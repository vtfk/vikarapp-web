/*
  Import modules
*/
import envToConfig from '../lib/env-to-config'

/*
  Default configuration
*/
const defaultConfig = {
  common: {
    loginUrl: '/loginredirect',
    storage: 'local',
    login: {
      type: 'redirect'
    }
  },
  providers: {
    azuread: {
      client: {
        auth: {
          clientId: '[Requred in environment variables]',
          authority: 'https://sts.windows.net/08f3813c-9f29-482f-9aec-16ef7cbf477a',
          redirectUri: 'http://localhost:3000/handlelogin',
          navigateToLoginRequestUrl: false,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false,
        }
      },
      login: {
        scopes: ['clientId/.default']
      }
    }
  }
}

const config = envToConfig(defaultConfig, 'auth');
console.log('Authentication config', config)

export default config;