[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Work In Progress](https://img.shields.io/badge/Status-Work%20In%20Progress-yellow)](https://unitvectory-labs.github.io/uvy-labs-guide/bestpractices/status/#work-in-progress)

# serviceauthcentralweb

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

## Test Deployments

Pull requests are automatically deployed to test envirionment to allow for testing.
