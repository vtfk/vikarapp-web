const redirectUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/handlelogin' : 'https://witty-water-0af444f03.1.azurestaticapps.net/handlelogin'

const config = {
  auth: {
    loginUrl: '/loginredirect',
    storage: 'local',
    loginMethod: 'redirect',
    loginOptions: {
    }
  },
  providers: {
    azuread: {
      client: {
        auth: {
          clientId: 'e4ecefc1-524f-4be8-9ac7-dbd23902b533',
          authority: 'https://login.microsoftonline.com/08f3813c-9f29-482f-9aec-16ef7cbf477a',
          redirectUri: redirectUrl,
          navigateToLoginRequestUrl: false,
          postLogoutRedirectUri: 'https://www.vtfk.no/'
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false
        }
      },
      login: {
        scopes: ['e4ecefc1-524f-4be8-9ac7-dbd23902b533/.default']
      }
    }
  },
  vikarAPIBaseurl: process.env.VTFK_VIKARAPI_BASEURL || 'http://localhost:7070/api/'
}

module.exports = config;