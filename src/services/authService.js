// src/services/authService.js
import PKCE from 'js-pkce';
import store from '@/store'; 

const pkce = new PKCE({
    client_id: 'provider:github',
    redirect_uri: process.env.VUE_APP_SAC_REDIRECT_URI,
    authorization_endpoint: process.env.VUE_APP_SAC_AUTHORIAZATION_ENDPOINT,
    token_endpoint: process.env.VUE_APP_SAC_TOKEN_ENDPOINT,
  });

export const authorize = () => {
  const authorizationUrl = pkce.authorizeUrl();
  window.location.replace(authorizationUrl);
};

export const exchangeToken = async () => {
  const url = window.location.href;
  try {
    const additionalParams = { audience: process.env.VUE_APP_SAC_ISSUER };
    const resp = await pkce.exchangeForAccessToken(url, additionalParams);
    const token = resp.access_token;
    // Save the token for vuex
    store.dispatch('signIn', token);

    return token;
  } catch (error) {
    console.error('Token exchange error:', error);
    throw error;
  }
};
