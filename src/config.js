import envToConfig from "./lib/env-to-config";

let config = undefined;

const defaultConfig = {
  VTFK_VIKARAPI_BASEURL: process.env.NODE_ENV === 'development' ? 'http://localhost:7070/api/' : process.env.REACT_APP_VTFK_VIKARAPI_BASEURL,
  USE_MOCK: false
}

if(!config) config = envToConfig(defaultConfig)

export default config;