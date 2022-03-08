const config = {
  vikarAPIBaseurl: process.env.NODE_ENV === 'development' ? 'http://localhost:7070/api/' : process.env.REACT_APP_VTFK_VIKARAPI_BASEURL
}

module.exports = config;