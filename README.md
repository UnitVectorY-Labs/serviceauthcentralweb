[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Work In Progress](https://img.shields.io/badge/Status-Work%20In%20Progress-yellow)](https://guide.unitvectorylabs.com/bestpractices/status/#work-in-progress)

# serviceauthcentralweb

Web based management interface for ServiceCloudAuth

## References

- [ServiceAuthCentral](https://github.com/UnitVectorY-Labs/ServiceAuthCentral) - Simplify microservice security with ServiceAuthCentral: Centralized, open-source authorization in the cloud, minus the shared secrets.
- [ServiceAuthCentral Documentation](https://unitvectory-labs.github.io/ServiceAuthCentral/) - Documentation for ServiceAuthCentral
- [serviceauthcentralweb](https://github.com/UnitVectorY-Labs/serviceauthcentralweb) - Web based management interface for ServiceCloudAuth
- [serviceauthcentral-client-java](https://github.com/UnitVectorY-Labs/serviceauthcentral-client-java) - Java client for requesting tokens from the ServiceAuthCentral OAuth 2.0 authorization server.
- [serviceauthcentral-gcp-tofu](https://github.com/UnitVectorY-Labs/serviceauthcentral-gcp-tofu) - OpenTofu module for deploying a fully working ServiceAuthCentral deployment in GCP

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

The configuration for this application requires the following configuration for a production deployment that are created in `.env.production`

```
VUE_APP_SAC_MANAGE_URI=
VUE_APP_SAC_REDIRECT_URI=
VUE_APP_SAC_AUTHORIAZATION_ENDPOINT=
VUE_APP_SAC_TOKEN_ENDPOINT=
VUE_APP_SAC_ISSUER=
```

- `VUE_APP_SAC_MANAGE_URI`: The "/graphql" URL for ServiceAuthCentral's manage server
- `VUE_APP_SAC_REDIRECT_URI`: The "/callback" URL for serviceauthcentralweb
- `VUE_APP_SAC_AUTHORIAZATION_ENDPOINT`: The "/login/authorize" URL for ServiceAuthCentral's token server
- `VUE_APP_SAC_TOKEN_ENDPOINT`: The "/v1/token" URL for ServiceAuthCentral's token server
- `VUE_APP_SAC_ISSUER`: The issuer configured for ServiceAuthCentral
