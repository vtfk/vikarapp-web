import envToConfig from "./lib/envToObj";

let config = undefined;

const defaultConfig = {
  VTFK_VIKARAPI_BASEURL: process.env.NODE_ENV === 'development' ? 'http://localhost:7070/api/' : process.env.REACT_APP_VTFK_VIKARAPI_BASEURL,
  VTFK_VIKARAPI_APPKEY: process.env.REACT_APP_AZF_APPKEY,
  USE_MOCK: false
}

if(!config) config = envToConfig(defaultConfig)
console.log('Application configuration', config)

export default config;