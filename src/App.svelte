<script lang="ts">
  import Router from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
  import { offline } from "./model/preferences";

  import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
  } from "sveltestrap";

  import {
    recordEvent,
    auth,
    isEditor,
    enableOfflineDataMode,
  } from "./firebase";
  import {
    FacebookAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    // setPersistence, browserLocalPersistence,
  } from "firebase/auth";
  import HomePage from "./components/HomePage.svelte";
  import Settings from "./components/Settings.svelte";
  import Browse from "./components/Browse.svelte";
  import Edit from "./components/Edit.svelte";
  import EditLocation from "./components/EditLocation.svelte";
  import PrayerList from "./components/PrayerList.svelte";
  import LectionList from "./components/LectionList.svelte";

  const routes = {
    "/": HomePage,
    "/settings": Settings,
    "/browse": Browse,
    "/office/:officeName": HomePage,
    "/office/:officeName/date/:officeDate": HomePage,
    "/edit/:id": Edit,
    "/editlocation/:id": EditLocation,
    "/prayers/:c": PrayerList,
    "/lection/:location ": LectionList,
  };

  $: loggedIn = false;
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      loggedIn = true;
      toasts.success("logged in", user.displayName, { uid: 10 });
      if ((await isEditor()) === true) {
        toasts.info("Editor permissions", user.displayName, { uid: 11 });
      } else {
        toasts.info("User permissions", user.displayName, { uid: 11 });
      }
    } else {
      loggedIn = false;
      toasts.success("logged out", null, { uid: 12 });
      recordEvent("log out");
    }
  });

  async function doFBLogin() {
    try {
      // await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, new FacebookAuthProvider());
      loggedIn = true;
      recordEvent("login");
    } catch (e) {
      toasts.error(e.message, null, { uid: 13 });
      console.log(e);
    }
  }

  async function doGLogin() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      loggedIn = true;
      recordEvent("login");
    } catch (e) {
      toasts.error(e.message, null, { uid: 14 });
      console.log(e);
    }
  }

  async function doLogout() {
    try {
      await signOut(auth);
      loggedIn = false;
    } catch (e) {
      toasts.error(e, null, { uid: 15 });
      console.log(e);
    }
  }

  if ($offline) enableOfflineDataMode();

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
        {#if loggedIn}
          <NavItem><NavLink href="#/settings">Settings</NavLink></NavItem>
          <NavItem>
            <NavLink href="#" on:click={doLogout}>Log Out</NavLink>
          </NavItem>
        {:else}
          <NavItem>
            <NavLink href="#" on:click={doFBLogin}>Facebook Login</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" on:click={doGLogin}>Google Login</NavLink>
          </NavItem>
        {/if}
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

<footer class="footer mx-5">
  <p class="small text-end">
    This site uses cookies for authentication purposes. <a
      href="/wado-privacy"
      target="new">Privacy Policy</a
    >
  </p>
  <p class="text-muted text-end small">
    Copyright &copy;
    <a href="https://saint-luke.net/"> The Order of St. Luke 2022. </a>
    All Rights Reserved. &nbsp;|&nbsp; Build date: __buildDate__
  </p>
  <p class="small text-end">
    <a href="https://www.facebook.com/groups/3354160484857281">
      WADO user group
    </a>&nbsp; | &nbsp;
    <a href="https://github.com/cloudkucooland/wado-firebase"> GitHub </a>
  </p>
</footer>

<style>
  :global(html),
  :global(body) {
    height: 100%;
    font-weight: normal;
  }
  :global(body) {
    display: flex;
    flex-direction: column;
  }
  :global(a:hover) {
    text-decoration: none;
  }
  :global(navbar) {
    padding-right: 60px;
    padding-left: 30px;
  }
  :global(.navbar a) {
    font-weight: 700;
    border-bottom: 1px solid transparent;
  }
  :global(.navbar a:hover) {
    border-bottom: 1px solid #33cc99;
  }
  :global(.content-area) {
    padding: 0 16px 16px 16px;
  }
  :global(.card) {
    margin-top: 20px;
  }
  :global(.card-header) {
    font-size: 150%;
    font-weight: 700;
  }
  :global(footer) {
    font-size: 80%;
    font-weight: 500;
  }
  :global(copyright) {
    font-weight: 700 !important;
  }
  .text-muted {
    font-weight: normal;
  }
</style>
