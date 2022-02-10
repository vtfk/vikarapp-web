const redirectUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/handlelogin' : 'https://witty-water-0af444f03.1.azurestaticapps.net/handlelogin'

export const config = {
  auth: {
    loginUrl: '/login',
    storage: 'local',
    loginRequest: {
      scopes: ['openid', 'profile', 'User.Read']
    }
  },
  msal: {
    auth: {
      clientId: 'e4ecefc1-524f-4be8-9ac7-dbd23902b533',
      authority: 'https://login.microsoftonline.com/08f3813c-9f29-482f-9aec-16ef7cbf477a',
      redirectUri: redirectUrl,
      navigateToLoginRequestUrl: false,
      postLogoutRedirectUri: 'https://www.vtfk.no/'
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false
    }
  },
  msal_scopes: ['openid', 'profile', 'User.Read']
}

// See valid values here: https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_request_redirectrequest_.html
export const loginRequest = {
  scopes: ['openid', 'profile', 'User.Read']
}