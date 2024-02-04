<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <h2>Welcome to ServiceAuthCentral <a class="btn btn-light" data-bs-toggle="offcanvas" href="#whatIsServiceAuthCentral" role="button" aria-controls="whatIsServiceAuthCentral"><i class="bi bi-info-circle-fill"></i></a></h2>
                <div class="accordion accordion-flush" id="accordionHomeInfo">
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#jsonWebKeySets" aria-expanded="false" aria-controls="jsonWebKeySets">
                        JSON Web Key Sets
                      </button>
                    </h2>
                    <div id="jsonWebKeySets" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionHomeInfo">
                      <div class="accordion-body">
                        <p>The JSON Web Key Set (JWKS) endpoint is a critical component in the security architecture of ServiceAuthCentral. It provides a set of keys that are used by clients to verify the authenticity of JWT tokens issued by the authorization server. Here's what you need to know:</p>
                        <ul class="list-unstyled">
                          <li><strong>What is JWKS?</strong> - JWKS is a collection of cryptographic keys in a JSON format, accessible through a specific URL endpoint. These keys are used to validate JWT tokens, ensuring their integrity and authenticity.</li>
                          <li><strong>Endpoint URL:</strong> - <a :href="jwksUrl" target="_blank">{{jwksUrl}}</a> This URL is used by your services to retrieve the public keys necessary for validating JWT tokens.</li>
                          <li><strong>Caching Keys:</strong> - Clients must implement caching of the JWKS keys to reduce the number of requests to the JWKS endpoint.</li>
                          <li><strong>Key Rotation:</strong> - ServiceAuthCentral implements key rotation to enhance security. New keys are added and old keys are phased out over time, allowing for JWTs signed with older keys to expire naturally. This process ensures that your services always use up-to-date keys for validation.</li>
                        </ul>
                        <p>Integrating the JWKS endpoint into your service authentication flow enhances security by enabling real-time validation of JWT tokens, ensuring they have been issued by ServiceAuthCentral and have not been tampered with.</p>
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingTwo">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#headingMicroserviceAuth" aria-expanded="false" aria-controls="headingMicroserviceAuth">
                        Microservice Authentication
                      </button>
                    </h2>
                    <div id="headingMicroserviceAuth" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionHomeInfo">
                      <div class="accordion-body">
                        <p>Centralized authorization is at the heart of ServiceAuthCentral, enabling secure and streamlined access management between services. This system simplifies how services authenticate and authorize each other, leveraging the power of JWTs. Here's how it works:</p>
                        <ul class="list-unstyled">
                          <li><strong>Centralized Access Management:</strong> ServiceAuthCentral allows administrators to specify which services can access others. This is managed through the JWTs' subject and audience claims, ensuring that authorization logic is centralized rather than scattered across services.</li>
                          <li><strong>Authorization Before Issuance:</strong> When a client requests a JWT for a specific audience, ServiceAuthCentral verifies the client's authorization to access the intended service. Only after this verification is the JWT issued, offloading the authorization responsibility from the target service to ServiceAuthCentral.</li>
                          <li><strong>Authentication Without Client Secrets:</strong> By utilizing JWTs from other systems, such as GCP service accounts, ServiceAuthCentral facilitates authentication without the need for traditional client secrets. This method enhances security by leveraging existing trusted systems to authenticate clients.</li>
                          <li><strong>Streamlined Service Interactions:</strong> This approach means that the service being called does not have to manage or be aware of which clients are authorized to access it. This authorization process is handled entirely by ServiceAuthCentral, simplifying service interactions and security management.</li>
                        </ul>
                        <p>This centralized approach to authorization and authentication not only improves security but also significantly reduces the complexity and overhead associated with managing access between microservices. ServiceAuthCentral ensures that services can securely and efficiently communicate with each other, with minimal configuration required on the part of each service.</p>
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item" v-if="isTokenSet">
                    <h2 class="accordion-header" id="headingThree">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#tokenExchange" aria-expanded="false" aria-controls="tokenExchange">
                        Token Exchange
                      </button>
                    </h2>
                    <div id="tokenExchange" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionHomeInfo">
                      <div class="accordion-body">
                        <p>To interact with secured services, clients must first obtain a token from ServiceAuthCentral. This can be done using either the <code>client_credentials</code> flow or the <code>urn:ietf:params:oauth:grant-type:jwt-bearer</code> flow. Below are examples of how to request tokens using these flows.</p>
                        <div class="card">
                          <div class="card-header">
                            <strong>Client Credentials Flow</strong>
                            <p>Use this flow when you have a client secret (not preferred) to request an access token for your desired audience.</p>
                          </div>
                          <div class="card-body bg-dark text-white">
<pre><code>curl -X POST "{{ tokenUrl }}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=client_credentials" \
  --data-urlencode "client_id=your_client_id" \
  --data-urlencode "client_secret=your_client_secret" \
  --data-urlencode "audience=audience_to_access_client_id"
</code></pre>
                          </div>
                        </div>
                        <br />
                        <div class="card">
                          <div class="card-header">
                            <strong>JWT Bearer Token Flow</strong>
                            <p>Use this flow when you want to authenticate using a JWT from another service, such as a GCP service account, without a client secret. The audience parameter is still required.</p>
                          </div>
                          <div class="card-body bg-dark text-white">
<pre><code>curl -X POST "{{ tokenUrl }}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" \
  --data-urlencode "assertion=eyJhbGF...7EEaTA" \
  --data-urlencode "client_id=your_client_id" \
  --data-urlencode "audience=audience_to_access_client_id"
</code></pre>
                          </div>
                        </div>
                        <br />
                        <p>In both requests, the <code>audience</code> parameter is crucial as it specifies which service the token should grant access to. This parameter is checked against the authorization policies configured in ServiceAuthCentral to ensure the requesting client is authorized to access the specified service.</p>
                        
                        <div class="card">
                          <div class="card-header">
                            <strong>Response</strong>
                        <p>The response follows the standard OAuth 2.0 response format with the token being returned as a JWT.</p>
                          </div>
                          <div class="card-body bg-dark text-white">
<pre><code>
{
  "access_token": "eyJhbGF...7EEaTA",
  "token_type": "Bearer",
  "expires_in": 3600
}
</code></pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
    <div class="offcanvas offcanvas-start" tabindex="-1" id="whatIsServiceAuthCentral" aria-labelledby="whatIsServiceAuthCentralLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="whatIsServiceAuthCentralLabel">What is ServiceAuthCentral?</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div>
          <p>ServiceAuthCentral is a powerful tool designed to streamline authorization for microservices. Here's what makes it stand out:</p>
          <ul>
            <li><strong>Open Source:</strong> Freely available <a href="https://github.com/UnitVectorY-Labs/ServiceAuthCentral"><i class="bi bi-github"></i></a> consisting of a centralized authorization server, management server, and web based management frontend you can easily host yourself.</li>
            <li><strong>Server-to-Server Authentication:</strong> Targets solving server-to-server authentication for microservices using the client credentials OAuth 2.0 flow.</li>
            <li><strong>Advanced Security:</strong> Advocates for the <span class="text-secondary fw-bold">urn:ietf:params:oauth:grant-type:jwt-bearer</span> flow to reduce reliance on shared secrets.</li>
            <li><strong>Elimination of Shared Secrets:</strong> Cloud based clients can utilize usings JWTs such as GCP Service accounts to authenticate thereby eliminating the need for shared secrets.</li>
            <li><strong>Modular Cloud-Native Backend:</strong> Utilizes a module backend to support cloud native technologies for data persistence and utilizes cloud services such as KMS for JWT signing eliminating direct access to power secrets.</li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'HomePage',
  data() {
    return {
      jwksUrl: process.env.VUE_APP_SAC_ISSUER + '/.well-known/jwks.json',
      tokenUrl: process.env.VUE_APP_SAC_ISSUER + '/v1/token',
    };
  },
  computed: {
    ...mapGetters(['isTokenSet']),
  },
}
</script>