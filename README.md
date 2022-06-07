# VikarApp-Web
This is the web frontend of VikarApp

More information about the system can be found [here](https://github.com/vtfk/azf-vikarapp-api)

## Development
### Setup
1. Install Node.js
1. Clone this repository
1. Run **npm i** to install packages

### Start development environment
1. Create a **.env** file with all environment variables below
1. Run **npm run start**

### Build the project
1. Run **npm run build**
## Environment variables
| Variable | Description | Example
|---|---|---|
|REACT_APP_auth.providers.azuread.client.auth.clientId | Azure App ClientId|43c96b94-41f9-445f-bae4-22280c5df379
|REACT_APP_auth.providers.azuread.client.auth.authority | Azure Authority URL | https://login.microsoftonline.com/[TenantID]/
|REACT_APP_auth.providers.azuread.login.scopes | Application scopes | ['[AzureAppClientID]/.default']
|REACT_APP_VTFK_VIKARAPI_BASEURL | The base URL of the VikarApp API | https://[url]/
|REACT_APP_VTFK_VIKARAPI_APPKEY | The Azure Function key | 
|REACT_APP_SENTRY_DSN | Sentry data source name for logging | 
