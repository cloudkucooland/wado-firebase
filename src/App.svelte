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
  } from "sveltestrap";

  import { recordEvent } from "./firebase";
  import HomePage from "./components/HomePage.svelte";
  import Settings from "./components/Settings.svelte";
  import Login from "./components/Login.svelte";
  import Admin from "./components/Admin.svelte";
  import Browse from "./components/Browse.svelte";

  const routes = {
    // Exact path
    "/": HomePage,
    "/:office/*": HomePage,
    "/settings": Settings,
    "/login": Login,
    "/admin": Admin,
    "/search": Browse,
    "/browse": Browse,
  };

  recordEvent("startup");
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
/>
<svelte:head />

<header>
  <Navbar container={false} color="dark" dark expand="lg">
    <NavbarToggler id="main-toggler" />
    <Collapse toggler="#main-toggler" navbar expand="lg">
      <Nav navbar>
        <NavItem><NavLink href="#/">WADO</NavLink></NavItem>
        <NavItem><NavLink href="#/settings">Settings</NavLink></NavItem>
        <NavItem><NavLink href="#/login">Login</NavLink></NavItem>
        <NavItem><NavLink href="#/admin">Admin</NavLink></NavItem>
        <NavItem>
          <NavLink href="https://saint-luke.net">OSL</NavLink>
        </NavItem>
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
    <p class="small">This site uses cookies for authentication purposes.</p>
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
