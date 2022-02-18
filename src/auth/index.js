/*
  Import dependencies
*/
import * as microsoftTeams from '@microsoft/teams-js';
import { isFromTeams, getTeamsContext } from './lib/helpers';
const config = require('../config');
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
export function getValidToken(options = config.auth || {}) {
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
 * Returns a string in the 'Bearer <AccessToken>' format if there is a valid token
 */
export function getValidBearerToken() {
  const validToken = getValidToken();
  if(!validToken || !validToken.token) return;

  return `Bearer ${validToken.token.accessToken || validToken.token.token || validToken.token.idToken }`
}

/**
 * Returns true if authenticated, false if not
 * @param {Object} options 
 * @returns {Boolean}
 */
 export function isAuthenticated(options = config.auth || {}) {
  if(getValidToken(options)) return true;
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
  options = Object.assign(config.auth, options);
  
  // Parse and prepare the token
  const formattedToken = {
    provider: options.provider || 'azuread',
    username: token.account?.username || token.idTokenClaims?.preferred_username || undefined,
    expiration: token.expiresOn || token.extExpiresOn || token.expiration || token.exp,
    scopes: token.scopes || options.scopes || [],
    roles: token.roles || token.idTokenClaims?.roles || token.account?.idTokenClaims?.roles || [],
    token: token
  }

  // Save the token
  if(options.storage === 'local') localStorage.setItem(tokenName, JSON.stringify(formattedToken))
  else sessionStorage.setItem(tokenName, JSON.stringify(formattedToken))

  // Return the saved token
  return token;
}

function getProvider(options) {
  const providerName = options?.provider || config.auth.provider || 'azuread';
  const provider = providers[providerName];
  if(!provider) throw new Error('Cannot authenticate because no authentication provider was found');
  if(!provider.name) throw new Error('Authentication provider cannot be used because it has no name implemented');
  return provider;
}

function getProviderConfiguration(providerName, clientOptions, loginOptions) {
  let providerClientOptions = providerHelpers.getProviderClientConfig(providerName) || {};
  providerClientOptions = Object.assign(providerClientOptions, config.auth.clientOptions || {}, clientOptions || {})
  let providerLoginOptions = providerHelpers.getProviderLoginConfig(providerName) || {};
  providerLoginOptions = Object.assign(providerLoginOptions, config.auth.loginOptions || {}, loginOptions || {});

  return { providerClientOptions, providerLoginOptions}
}

export async function login(options = {}) {
  try {
    /*
      Validation
    */
    if(isAuthenticated() && !options.force) return;
    if(authenticationPromise) return authenticationPromise;

    /*
      Declarations
    */
    // Token object that should be assigned, saved and returned in the bottom of the function
    let token = undefined; 
    // If is from teams, attempt to retreive a loginHint
    if(isFromTeams()) {
      console.log('Authentication is comming from Teams')
      const teamsContext = await getTeamsContext(microsoftTeams);
      if(teamsContext) config.auth.loginOptions.loginHint = teamsContext.loginHint || teamsContext.upn || teamsContext.userPrincipalName
    }

    /*
      Get what authentication provider to use and retreive its options
    */
    const provider = getProvider(options);
    const { providerClientOptions, providerLoginOptions } = getProviderConfiguration(provider.name);

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
        saveToken(token, config.auth);
        return token;
      } 
    } catch {}

    /*
      Make login request from Teams
      This is a special case that can be used by most auth providers
      Everything here will be handled here and return early not hitting services below
      Teams auth works by creating a popup window that opens a login-route that redirects to the authprovider, then redirects back to a page that handles the response
    */
    if(isFromTeams() && !window?.location?.href.endsWith(config.auth.loginUrl)) {
      console.log('This should be triggered');
      const url = options.loginUrl || config.auth.loginUrl || `${window.location.href}`
      if(!url) throw new Error('Authentication not possible because config.auth.loginUrl is not set');
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
    if(provider.login && typeof provider.login === 'function') await provider.login(providerClientOptions, providerLoginOptions);

    /*
      Save and return the token
    */
    if(!token) throw new Error('Authentication failed, no token recevied')
    saveToken(token, config.auth);
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
      saveToken(token, config.auth);
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
