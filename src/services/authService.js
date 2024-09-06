/*
 * Copyright 2024 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 *
 * @author Jared Hatfield (UnitVectorY Labs)
 */
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
    const additionalParams = { 
      audience: process.env.VUE_APP_SAC_ISSUER,
      scope: 'Read Admin'
    };
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
