/*
  Import dependencies
*/
import * as microsoftTeams from '@microsoft/teams-js';
import * as msal from "@azure/msal-browser";
import { isFromTeams, isFromMobile } from './lib/helpers';
const { config } = require('../config')


/*
  Declarations
*/
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
  if(!options) options = {};
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
  if(getValidToken() && !options.force) return;

  // If the request is from Teams and it is not from the loginUrl
  console.log('IsFromTeams:', isFromTeams());
  console.log('Url:', window.location.href)
  if(isFromTeams() && !window?.location?.href.endsWith(config.auth.loginUrl)) {
    const teamsConfig = {
      url: options.loginUrl || `${window.location.href}login`,
      successCallback: (e) => { console.log('Successfully authenticated:', e); },
      failureCallback: (e) => { console.log('Failed authentication:', e)}
    }
    console.log('Creating popup!')
    microsoftTeams.authentication.authenticate(teamsConfig);
    return;
  }

  // Default or Azure AD
  if(!options.service || options.service === 'azuread') {
    if(!msalClient) msalClient = new msal.PublicClientApplication(config.msal);
    console.log('Redirect login Azure AD');
    msalClient.acquireTokenRedirect(config.msal);
  }
}

export function logout() {
  console.log('Logging out');
}

export async function handleRedirect() {
  try {
    console.log('Handeling redirectResponse')
    // Azure AD
    if(!msalClient) msalClient = new msal.PublicClientApplication(config.msal);
    const token = await msalClient.handleRedirectPromise();
    console.log('Response:', token);


    // Save the token;
    if(token) saveToken(token, config.auth);
    
    // If the request is from Microsoft Teams, notify
    if(isFromTeams()) {
      if(token) microsoftTeams.authentication.notifySuccess(true);
      // else microsoftTeams.authentication.notifyFailure('An unexpected authentication error occured')
    }

  } catch (err) {
    console.log('Redirection error:', err);
    if(isFromTeams()) microsoftTeams.authentication.notifyFailure(err)
  }
}