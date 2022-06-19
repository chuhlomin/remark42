<script lang="ts">
  import PoweredByRemark42 from './components/powered-by-remark.svelte';
  import CommentForm from './components/comment-form.svelte';
  import UserContainer from './containers/user.svelte';
  import { initUserStore } from './stores/user';
  import type { User } from '@remark42/api/typings';

  export let user: User | null = null;

  initUserStore(user);
</script>

<section>
  <header>
    <UserContainer />
    <CommentForm />
  </header>
  <main>main</main>
  <footer class="footer">
    <PoweredByRemark42 />
  </footer>
</section>

<style>
  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
