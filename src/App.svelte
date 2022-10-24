<script lang="ts">
  import Router, { location, replace } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { ToastContainer, FlatToast } from "svelte-toasts";

  import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    Input,
  } from "sveltestrap";

  import HomePage from "./components/HomePage.svelte";

  import { sendTokenToServer } from "./firebase";

  const routes = {
    // Exact path
    "/": HomePage,
    "/:office/*": HomePage,
  };

  async function onLogin(ev: { detail: any }) {}
</script>

<svelte:head />

<header>
  <Navbar container={false} color="dark" dark expand="lg">
    <NavbarToggler id="main-toggler" />
    <Collapse toggler="#main-toggler" navbar expand="lg">
      <Nav navbar>
        <NavItem><NavLink href="#/teams">Teams</NavLink></NavItem>
        <NavItem><NavLink href="#/operations">Operations</NavLink></NavItem>
      </Nav>
    </Collapse>
  </Navbar>
</header>
<main in:fade={{ duration: 500 }}>
  <ToastContainer let:data>
    <FlatToast {data} />
  </ToastContainer>
  <Router {routes} />
</main>

<footer class="mastfoot mx-5 mt-auto">
  <div class="p-5">
    <p class="text-muted small">
      This site uses cookies for authentication purposes.
    </p>
    <p class="text-muted text-right small">
      Copyright &copy; The Order of St. Luke 2022. All Rights Reserved
    </p>
    <p class="text-muted text-right small">Build date: __buildDate__</p>
  </div>
</footer>

<style>
  :global(html),
  :global(body) {
    height: 100%;
  }
  :global(body) {
    display: flex;
    flex-direction: column;
  }
</style>
