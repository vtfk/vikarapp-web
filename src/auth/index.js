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
  if(isAuthenticated() && !options.force) return;
  if(authenticationPromise) return authenticationPromise;

  /*
    Make login request from Teams
  */
  if(isFromTeams() && !window?.location?.href.endsWith(config.auth.loginUrl)) {
    // Attempt to retreive loginHint from TeamsContext
    const teamsContext = await getTeamsContext(microsoftTeams);
    if(teamsContext) {
      config.auth.loginRequest.loginHint = teamsContext.loginHint || teamsContext.upn || teamsContext.userPrincipalName
    }

    console.log('Teams Context');
    console.log(teamsContext);


    try {
      if(!msalClient) msalClient = new msal.PublicClientApplication(config.msal);
      
      const accounts = msalClient.getAllAccounts();
      if(accounts) config.auth.loginRequest.account = accounts[0];

      const token = await msalClient.acquireTokenSilent(config.auth.loginRequest);
      saveToken(token, config.auth);
      return token;
    } catch (err) {
      console.log('Error')
      console.log(err);
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
  }

  // Default or Azure AD
  if(!options.service || options.service === 'azuread') {
    if(!msalClient) msalClient = new msal.PublicClientApplication(config.msal);

    // First attempt to acquire token silently
    try {
      const accounts = msalClient.getAllAccounts();
      if(accounts) config.auth.loginRequest.account = accounts[0];
      const token = await this.authAgent.acquireTokenSilent(config.auth.loginRequest);
      saveToken(token);
    } catch {
      if(config.auth.loginMethod !== 'popup') {
        console.log('Redirect login Azure AD');
        msalClient.acquireTokenRedirect(config.auth.loginRequest);
      } else {
        console.log('Popup login Azure AD');
        try {
          const token = await msalClient.acquireTokenPopup(config.auth.loginRequest);
          saveToken(token);
        }
        catch (err) {
          Promise.reject(err);
        }
      }
    }
  }
}

export function logout() {
  console.log('Logging out');
  localStorage.removeItem(tokenName);
  sessionStorage.removeItem(tokenName);
}

export async function handleRedirect() {
  try {
    console.log('Handeling redirectResponse')
    // Azure AD
    if(!msalClient) msalClient = new msal.PublicClientApplication(config.msal);
    const token = await msalClient.handleRedirectPromise();
    console.log('Response:', token);

    // Save the token;
    if(token) {
      saveToken(token, config.auth);
      authenticationPromise = undefined;
    }
    
    // If the request is from Microsoft Teams, notify
    if(isFromTeams()) {
      console.log('Handling teams');
      if(token) microsoftTeams.authentication.notifySuccess(token);
      else microsoftTeams.authentication.notifyFailure('An unexpected authentication error occured')
    }

    return token;
  } catch (err) {
    console.log('Redirection error:', err);
    if(isFromTeams()) microsoftTeams.authentication.notifyFailure(err)
  }
}