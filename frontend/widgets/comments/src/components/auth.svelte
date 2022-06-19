<script lang="ts">
  import { writable } from 'svelte/store';
  import { createAuthClient } from '@remark42/api/clients/auth';
  import { user } from '../stores/user';

  const authClient = createAuthClient({ siteId: 'remark42', baseUrl: 'https://demo.remark42.com' });
  const username = writable('');

  function handleAnonymousAuth(evt: Event) {
    evt.preventDefault();
    authClient
      .anonymous($username)
      .then((data) => {
        user.set(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
</script>

<form on:submit={handleAnonymousAuth}>
  <input type="text" name="Username" bind:value={$username} />
  <button>Send</button>
</form>
