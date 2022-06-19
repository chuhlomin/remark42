<script lang="ts">
  import User from '../components/user.svelte';
  import { user, loading, loadUser } from '../stores/user';

  loadUser();
</script>

{#if $loading}
  <p>Loading...</p>
{:else if $user !== null}
  <User {...$user} />
{:else}
  unauthorized
{/if}
