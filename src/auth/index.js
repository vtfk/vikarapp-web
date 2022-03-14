/*
  Import dependencies
*/
import * as microsoftTeams from '@microsoft/teams-js';
import { isFromTeams, getTeamsContext } from './lib/helpers';
import merge from 'lodash.merge';
import config from './config';
const providers = require('./providers/_providers');
const providerHelpers = require('./providers/_helpers');

/*
  Declarations
*/
let authenticationPromise = undefined;
const tokenName = 'auth_token';


/**
 * Returns the current valid token if existing
 * @param {Object} options
 */
export function getValidToken(options = config.common || {}) {
  // Retreive the token from storage
  const rawToken = options.storage === 'local' ? localStorage.getItem(tokenName) : sessionStorage.getItem(tokenName);
  if(!rawToken) return;

  // Parse the token
  const token = JSON.parse(rawToken);

  // Don't return if the token has expired
  if(Date.parse(token.expiration) <= new Date()) return;

  // Don't return if the current token don't have the requred scopes
  const { providerLoginOptions } = getProviderConfiguration(token.provider);
  if(providerLoginOptions?.scopes) {
    // Return if the token don't have any scopes
    if(!token.scopes) return;
    // Return if the provider has more scopes than the token
    if(providerLoginOptions.scopes.length > token.scopes.length) return;
    // Return if the token don't contain the scopes of the provider
    for(const providerScope of providerLoginOptions.scopes) {
      if(!token.scopes.includes(providerScope)) return;
    }
  }
  
  // Return the token
  return token;
}

/**
 * Returns true if authenticated, false if not
 * @param {Object} options 
 * @returns {Boolean}
 */
export function isAuthenticated(options = config.common || {}) {
  if(getValidToken(options)) return true;
  return false;
}

/**
 * Checks if the logged in user has one or more roles
 * Will return true if any of the roles match
 * @param {String || [String]} roles 
 */
export function hasRole(roles) {
  if(!roles) return false;
  if(!Array.isArray(roles)) roles = [roles]

  const token = getValidToken();
  if(!token || !token.roles || !Array.isArray(token.roles) || token.roles.length === 0) return false;

  for(const role of roles) {
    if(typeof role !== 'string') continue;
    if(token.roles.includes(role)) return true;
  }
  return false;
}

/**
 * Saves a accessToken to storage
 * @param {Object} options 
 * @param {Object} token 
 * @returns 
 */
function saveToken(token, options = {}) {
  // Apply default values to the options
  if(!options) options = {};
  options = Object.assign(config.common, options);
  
  // Parse and prepare the token
  const formattedToken = {
    provider: options.provider || 'azuread',
    username: token.account?.username || token.idTokenClaims?.preferred_username || undefined,
    expiration: token.expiresOn || token.extExpiresOn || token.expiration || token.exp,
    scopes: token.scopes || options.scopes || [],
    language: token.idTokenClaims?.xms_pl,
    roles: token.roles || token.idTokenClaims?.roles || token.account?.idTokenClaims?.roles || [],
    bearerToken: `Bearer ${token.accessToken || token.token || token.idToken }`,
    token: token
  }

  // Save the token
  if(options.storage === 'local') localStorage.setItem(tokenName, JSON.stringify(formattedToken))
  else sessionStorage.setItem(tokenName, JSON.stringify(formattedToken))

  // Return the saved token
  return formattedToken;
}

function getProvider(options = {}) {
  const providerName = options?.provider || config.common.provider || 'azuread';
  const provider = providers[providerName];
  if(!provider) throw new Error('Cannot authenticate because no authentication provider was found');
  if(!provider.name) throw new Error('Authentication provider cannot be used because it has no name implemented');
  return provider;
}

function getProviderConfiguration(providerName, clientOptions, loginOptions) {
  let providerClientOptions = providerHelpers.getProviderClientConfig(providerName) || {};
  merge(providerClientOptions, providerClientOptions, config.common?.client || {} || clientOptions || {})
  let providerLoginOptions = providerHelpers.getProviderLoginConfig(providerName) || {};
  merge(providerLoginOptions, providerLoginOptions, config.common?.login || {} || loginOptions || {})

  return { providerClientOptions, providerLoginOptions}
}

export async function login(options = {}) {
  try {
    /*
      Validation
    */
    if(isAuthenticated() && !options.force) return getValidToken();
    if(authenticationPromise) return authenticationPromise;

    /*
      Declarations
    */
    // Token object that should be assigned, saved and returned in the bottom of the function
    let token = undefined; 
    // If is from teams, attempt to retreive a loginHint
    if(isFromTeams()) {
      const teamsContext = await getTeamsContext(microsoftTeams);
      if(teamsContext) config.common.login.loginHint = teamsContext.loginHint || teamsContext.upn || teamsContext.userPrincipalName
    }

    /*
      Get what authentication provider to use and retreive its options
    */
    const provider = getProvider(options);
    let { providerClientOptions, providerLoginOptions } = getProviderConfiguration(provider.name, {}, options);

    /*
      Initialize the provider if applicable
    */
    if(provider.initialize && typeof provider.initialize === 'function') await provider.initialize(providerClientOptions);

    /*
      Attempt to handle silent/SSO authentication before using methods that affect user experience
    */
    try {
      if(provider.silentLogin && typeof provider.silentLogin === 'function') {
        token = await provider.silentLogin(providerClientOptions, providerLoginOptions);
        if(!token) throw new Error('Silent token retreival failed')
        token = saveToken(token, config.common);
        return token;
      } 
    } catch {}

    /*
      Make login request from Teams
      This is a special case that can be used by most auth providers
      Everything here will be handled here and return early not hitting services below
      Teams auth works by creating a popup window that opens a login-route that redirects to the authprovider, then redirects back to a page that handles the response
    */
    if(isFromTeams() && !window?.location?.href.endsWith(config.common.loginUrl)) {
      const url = options.loginUrl || config.common.loginUrl || `${window.location.href}`
      if(!url) throw new Error('Authentication not possible because config.common.loginUrl is not set');
      authenticationPromise = new Promise((resolve) => {
        const teamsConfig = {
          url: url,
          successCallback: (e) => { resolve(getValidToken()); authenticationPromise = undefined; },
          failureCallback: (e) => { resolve(getValidToken()); authenticationPromise = undefined; } // There is a bug in teams-js that always trigger this, even on success
        }
        microsoftTeams.authentication.authenticate(teamsConfig);
      });
      return authenticationPromise;
    }

    /*
      Make regular auth provider request
    */
   console.log('Logging in with client', providerClientOptions);
   console.log('Logging in with login', providerLoginOptions)
    if(provider.login && typeof provider.login === 'function') token = await provider.login(providerClientOptions, providerLoginOptions);

    /*
      Save and return the token
    */
    if(!token) throw new Error('Authentication failed, no token recevied')
    token = saveToken(token, config.common);
    return token;
  } catch (err) {
    console.error('Authentication failed: ' + err.message);
    throw err;
  }
}

export function logout() {
  localStorage.removeItem(tokenName);
  sessionStorage.removeItem(tokenName);
}

export async function handleRedirect(options = {}) {
  try {
    // Get what authentication provider to use and retreive its options
    const provider = getProvider(options);
    const { providerClientOptions, providerLoginOptions } = getProviderConfiguration(provider.name);

    // Handle redirect and retreive token
    let token;
    if(provider.handleRedirect && typeof provider.handleRedirect === 'function') token = await provider.handleRedirect(providerClientOptions, providerLoginOptions);

    // Save the token;
    if(token) {
      saveToken(token, config.common);
      authenticationPromise = undefined;
    }
    
    // If the request is from a Teams client, notify it
    if(isFromTeams() || window.opener) {
      try{
        if(token) microsoftTeams.authentication.notifySuccess(token);
        else microsoftTeams.authentication.notifyFailure('An unexpected authentication error occured')
      } catch {}

      window.close();
    }

    // Return the token
    return token;
  } catch (err) {
    if(isFromTeams()) microsoftTeams.authentication.notifyFailure(err)
  }
}
