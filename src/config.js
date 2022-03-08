const config = {
  auth: {
    loginUrl: '/loginredirect',
    storage: 'local',
    loginOptions: {
      type: 'redirect'
    }
  },
  providers: {
    azuread: {
      client: {
        auth: {
          clientId: process.env.REACT_APP_auth_azuread_client_auth_clientId,
          authority: process.env.REACT_APP_auth_azuread_client_auth_authority,
          redirectUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/handlelogin' : process.env.REACT_APP_auth_azuread_client_auth_redirectUri,
          navigateToLoginRequestUrl: false,
          postLogoutRedirectUri: process.env.REACT_APP_auth_azuread_client_auth_postLogoutRedirectUri
        },
        cache: {
          cacheLocation: process.env.REACT_APP_auth_azuread_client_cache_cacheLocation || 'localStorage',
          storeAuthStateInCookie: false
        }
      },
      login: {
        scopes: [process.env.REACT_APP_auth_azuread_login_scopes]
      }
    }
  },
  vikarAPIBaseurl: process.env.VTFK_VIKARAPI_BASEURL || 'http://localhost:7070/api/'
}

module.exports = config;