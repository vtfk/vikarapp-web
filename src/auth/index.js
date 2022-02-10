/*
  Import dependencies
*/
import * as microsoftTeams from '@microsoft/teams-js';
import * as msal from "@azure/msal-browser";
import { isFromTeams, getTeamsContext } from './lib/helpers';
const { config } = require('../config')


/*
  Declarations
*/
let authenticationPromise = undefined;
const tokenName = 'auth_token';
let msalClient = undefined;


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
  if(Date.parse(token.expiresOn) <= new Date()) return;

  // Return the token
  return token;
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
    service: options.service || 'azuread',
    expiration: token.expiresOn || token.extExpiresOn || token.expiration || token.exp,
    scopes: options.scopes || [],
    token: token
  }

  // Save the token
  if(options.storage === 'local') localStorage.setItem(tokenName, JSON.stringify(formattedToken))
  else sessionStorage.setItem(tokenName, JSON.stringify(formattedToken))

  // Return the saved token
  return token;
}

export async function login(options = {}) {
  if(isAuthenticated() && !options.force) return;
  if(authenticationPromise) return authenticationPromise;

  /*
    Declarations
  */
  // Token object that should be assigned, saved and returned in the bottom of the function
  let token = undefined; 
  // If is from teams, attempt to retreive a loginHint
  if(isFromTeams()) {
    const teamsContext = await getTeamsContext(microsoftTeams);
    if(teamsContext) config.auth.loginRequest.loginHint = teamsContext.loginHint || teamsContext.upn || teamsContext.userPrincipalName
  }
  // Create AzureAD MSAL client if applicable
  if ((!options.service || options.service === 'azuread') && !msalClient) msalClient = new msal.PublicClientApplication(config.msal);

  /*
    Attempt to handle silent/SSO authentication before using methods that affect user experience
  */
  try {
    if(!options.service || options.service === 'azuread') {
      const accounts = msalClient.getAllAccounts();
      if(accounts && Array.isArray(accounts) && accounts.length > 0) config.auth.loginRequest.account = accounts.find((a) => a.username === config.auth?.loginRequest?.loginHint) || accounts[0];
      token = await msalClient.acquireTokenSilent(config.auth.loginRequest)
    }

    if(!token) throw new Error('Silent token retreival failed')
    saveToken(token, config.auth);
    return token;
  } catch {}

  /*
    Make login request from Teams
    This is a special case that can be used by most auth providers
    Everything here will be handled here and return early not hitting services below
  */
  if(isFromTeams() && !window?.location?.href.endsWith(config.auth.loginUrl)) {
    authenticationPromise = new Promise((resolve) => {
      const teamsConfig = {
        url: options.loginUrl || config.auth.loginUrl || `${window.location.href}`,
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
  // Default or Azure AD
  if(!options.service || options.service === 'azuread') {
    if(config.auth.loginMethod !== 'popup') {
      // Default: Redirection
      return msalClient.acquireTokenRedirect(config.auth.loginRequest);
    } else {
      // PopUp
      token = await msalClient.acquireTokenPopup(config.auth.loginRequest);
    }
  }

  // Save and return the token
  if(!token) throw new Error('Authentication failed, no token recevied')
  saveToken(token, config.auth);
  return token;
}

export function logout() {
  localStorage.removeItem(tokenName);
  sessionStorage.removeItem(tokenName);
}

export async function handleRedirect() {
  try {
    // Azure AD
    if(!msalClient) msalClient = new msal.PublicClientApplication(config.msal);
    const token = await msalClient.handleRedirectPromise();

    // Save the token;
    if(token) {
      saveToken(token, config.auth);
      authenticationPromise = undefined;
    }
    
    // If the request is from a Teams client, notify it
    if(isFromTeams()) {
      if(token) microsoftTeams.authentication.notifySuccess(token);
      else microsoftTeams.authentication.notifyFailure('An unexpected authentication error occured')
    }

    return token;
  } catch (err) {
    if(isFromTeams()) microsoftTeams.authentication.notifyFailure(err)
  }
}
