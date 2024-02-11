<template>
  <div>
    <!-- Display authorizations for subjects if client is not null -->
    <h3>Authorized as Subject</h3>
    <span class="text-muted"
      >The "<span class="text-primary fw-bold">{{ client.clientId }}</span
      >" client is authorized to access the following clients.</span
    >
    <table class="table table-striped table-hover mt-2">
      <!-- Table headers here -->
      <thead class="table-dark">
        <tr>
          <th scope="col">Client Id</th>
          <th scope="col">Scopes</th>
          <th scope="col">Created</th>
          <th scope="col" class="text-end">
            <!-- Right now not allowing granting access to other resources on a client page, just granting access to other clients. -->
            <button type="button" class="btn btn-success float-end invisible" disabled="disabled">
              <i class="bi bi-plus"></i>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through authorizationsAsSubject and display them in rows -->
        <tr v-for="authorization in client.authorizationsAsSubject" :key="authorization.id">
          <td>
            <p class="text-break">{{ authorization.audience.clientId }}</p>
          </td>
          <td>
            <span class="badge text-bg-dark" v-for="scope in authorization.authorizedScopes" :key="scope">{{
              scope
            }}</span>
          </td>
          <td><DateTimeComponent :date="authorization.authorizationCreated" /></td>
          <td class="text-end">
            <div class="btn-group" role="group">
              <!-- Right now not allowing deauthorize either -->
              <button type="button" class="btn btn-danger float-end invisible" disabled="disabled">
                <i class="bi bi-trash"></i>
              </button>
              <router-link
                :to="'/clients/' + encodeURIComponent(authorization.audience.clientId)"
                class="btn btn-primary"
              >
                <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="client.authorizationsAsSubject.length == 0" class="text-center p-3">
      <span class="fw-lighter">No authorizations.</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['client'],
};
</script>
