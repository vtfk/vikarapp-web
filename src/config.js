const config = {
  VTFK_VIKARAPI_BASEURL: process.env.NODE_ENV === 'development' ? 'http://localhost:7070/api/' : process.env.REACT_APP_VTFK_VIKARAPI_BASEURL,
  VTFK_VIKARAPI_APPKEY: process.env.REACT_APP_VTFK_VIKARAPI_APPKEY,
  USE_MOCK: process.env.USE_MOCK || false
}

export default config;