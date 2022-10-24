<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Nav, NavLink } from "sveltestrap";
  import { FlatToast, ToastContainer } from "svelte-toasts";
  import { notifyError } from "../notify";

  export const dispatch = createEventDispatcher();
</script>

<svelte:head>
  <link href="https://saint-luke.net/static/css/wado.css" rel="stylesheet" />
</svelte:head>

<header class="masthead mx-auto mb-auto">
  <Nav class="nav-masthead" justified>
    <NavLink href="https://www.youtube.com/">Youtube</NavLink>
    <NavLink class="nav-brand" />
  </Nav>
</header>

<main role="main" class="cover-container text-center mx-auto">
  <ToastContainer let:data>
    <FlatToast {data} />
  </ToastContainer>
  <h1 class="display-2 font-weight-bold">WADO</h1>
  <p class="h2">Web-Amplified Daily Office</p>
  <hr />
  <!-- <div class="lead serverlist">
    {#each servers as server}
      <button
        on:click={() => loginTo(server.url)}
        class={'btn btn-block ' +
          (disabledServer[server.url] ? 'btn-danger' : 'btn-success')}
      >
        Login to {server.name}{#if connecting == server.url}<span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />{/if}
      </button>
    {/each}
  </div> -->
</main>
