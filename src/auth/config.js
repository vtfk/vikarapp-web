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
    loginOptions: {
      type: 'redirect'
    }
  },
  providers: {
    azuread: {
      client: {
        auth: {
          redirectUri: 'http://localhost:3000/handlelogin',
          navigateToLoginRequestUrl: false,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false
        }
      },
    }
  }
}

const config = envToConfig(defaultConfig, 'auth');
console.log('Authentication config', config)

export default config;