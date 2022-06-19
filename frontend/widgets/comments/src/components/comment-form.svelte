<script lang="ts">
  import { user } from '../stores/user';
  import Auth from './auth.svelte';
</script>

<section>
  <form />
  {#if $user === null}
    <Auth />
  {/if}
</section>
