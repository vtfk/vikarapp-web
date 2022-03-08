/*
  Import modules
*/
import set from 'lodash.set'
import merge from 'lodash.merge'

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

/*
  Retreive configuration from environment variables
*/
const regex = /REACT_APP_auth_|VUE_APP_auth_|auth_/
const environmentConfig = {}
for(const key of Object.keys(process.env)) {
  const match = regex.exec(key)
  if(match && match[0]) {
    // Trim away the matched part and replace _ with . to get a valid Javascript object path
    const path = key.replace(match[0], '').replaceAll('_', '.')
    // Trim whitespaces from the value
    let value = process.env[key].trim();

    // Handle arrays
    if(value.startsWith('[') && value.endsWith(']')) {
      value = value.substring(1, value.length - 1)
      value = value.split(',').map((i) => { 
        if((i.startsWith("'") && i.endsWith("'")) || (i.startsWith('"') && i.startsWith('"'))) return i.substring(1, i.length - 1).trim()
        return i
      })
    }

    // Set the value to the environment config
    set(environmentConfig, path, value)
  }
}

/*
  Merge the default and environment variable configurations
*/
let config = {}
merge(config, defaultConfig, environmentConfig)

if(process.env.NODE_ENV === 'development') console.log('Authentication config', config)

export default config;