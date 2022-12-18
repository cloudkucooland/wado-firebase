<script lang="ts">
  import Router from "svelte-spa-router";
  // import { wrap } from "svelte-spa-router/wrap";
  import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    NavbarBrand,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from "sveltestrap";
  import {
    recordEvent,
    auth,
    enableOfflineDataMode,
    initAnalytics,
  } from "./firebase";
  import {
    FacebookAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
  } from "firebase/auth";
  import { setContext } from "svelte";
  import { type Writable, writable } from "svelte/store";
  import user from "./model/user";

  // public
  import HomePage from "./components/HomePage.svelte";
  import _Styles from "./Styles.svelte";

  // for authenticated users
  import Settings from "./components/Settings.svelte";
  import Users from "./components/Users.svelte";
  import Search from "./components/Search.svelte";

  // for editors
  import Edit from "./components/Edit.svelte";
  import EditLocation from "./components/EditLocation.svelte";
  import PrayerList from "./components/PrayerList.svelte";
  import LectionList from "./components/LectionList.svelte";
  import AddPrayer from "./components/AddPrayer.svelte";

  import "@beyonk/gdpr-cookie-consent-banner/dist/style.css";
  import GdprBanner from "@beyonk/gdpr-cookie-consent-banner";
  const choices = {
    necessary: {
      label: "Necessary cookies",
      description: "Used for cookie control. Can't be turned off.",
      value: true,
    },
    tracking: false,
    analytics: {
      label: "Analytics cookies",
      description:
        "Used to control Google Analytics, a 3rd party tool offered by Google which provides metrics used to improve WADO.",
      value: true,
    },
    marketing: false,
  };
  const showEditIcon = false;

  const routes = {
    "/": HomePage,
    "/office/:officeName/:officeDate": HomePage,

    "/settings": Settings,
    "/search": Search,
    "/users": Users,

    "/edit/:id": Edit,
    // "/edit/:id": wrap({ asyncComponent: () => import('./components/Edit.svelte') }),
    "/editlocation/:id": EditLocation,
    "/prayers/:c": PrayerList,
    "/addPrayer": AddPrayer,
    "/lectionary/:y": LectionList,
    "*": HomePage,
  };

  $: loggedIn = false;
  let me: Writable<user> = writable(new user({}));
  setContext("me", me);

  onAuthStateChanged(auth, async (u) => {
    if (u) {
      loggedIn = true;
      // @ts-ignore
      $me = await user.me();
      // @ts-ignore
      await $me.logAction();
      // @ts-ignore
      if ($me.isEditor) toasts.info("Editor permissions", u.displayName);
    } else {
      loggedIn = false;
    }
  });

  async function doFBLogin(): Promise<void> {
    try {
      await signInWithPopup(auth, new FacebookAuthProvider());
      loggedIn = true;
      recordEvent("Facebook login");
    } catch (err) {
      toasts.error(err.message);
      console.log(err);
    }
  }

  async function doGLogin(): Promise<void> {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      loggedIn = true;
      recordEvent("Google login");
    } catch (err) {
      toasts.error(err.message);
      console.log(err);
    }
  }

  async function doLogout(): Promise<void> {
    try {
      await signOut(auth);
      loggedIn = false;
      recordEvent("log out");
      toasts.success("logged out");
    } catch (err) {
      toasts.error(err.messasge);
      console.log(err);
    }
  }

  function startNotification(): void {
    // not on a platform that has the Notifications API
    if (typeof Notification === "undefined") return;
    // permission neither granted nor denied
    if (Notification.permission === "default") {
      const tp = toasts.success(
        "WADO Reminders",
        "Click to allow WADO to send reminders to pray",
        {
          onClick: () => {
            Promise.resolve(Notification.requestPermission()).then((p) => {
              console.log("granted notification permission", p);
            });
            tp.remove();
          },
          duration: 0,
        }
      );
    }
  }

  enableOfflineDataMode();

  if ("serviceWorker" in navigator) {
    let found = false;
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((r) => {
        if (
          r.active.scriptURL ==
            "https://saint-luke.net/wado/service-worker.js" &&
          r.active.state == "activated"
        ) {
          found = true;
          r.update();
        }
      });
    });
    if (!found) {
      navigator.serviceWorker.register("service-worker.js");
    }
    startNotification();
  }
</script>

<header>
  <Navbar container={false} color="dark" dark expand="lg">
    <NavbarBrand href="/wado/#/"
      ><img
        src="ox.svg"
        height="64"
        width="64"
        alt="current office"
      /></NavbarBrand
    >
    <NavbarToggler id="main-toggler" />
    <Collapse toggler="#main-toggler" navbar expand="lg">
      <Nav class="ms-auto" navbar>
        {#if loggedIn}
          <Dropdown nav inNavbar>
            <DropdownToggle nav caret>Tools</DropdownToggle>
            <DropdownMenu>
              <DropdownItem href="#/search">Search</DropdownItem>
              <DropdownItem href="#/editlocation/UNSET"
                >Location List</DropdownItem
              >
              <DropdownItem href="#/prayers/prayer">Prayer List</DropdownItem>
              <DropdownItem href="#/lectionary/A">Lectionary</DropdownItem>
              <DropdownItem href="#/addPrayer">Add a Prayer</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavItem><NavLink href="#/settings">Settings</NavLink></NavItem>
          <NavItem>
            <NavLink href="#" on:click={doLogout}>Log Out</NavLink>
          </NavItem>
        {:else}
          <Dropdown nav inNavbar>
            <DropdownToggle nav caret>Login</DropdownToggle>
            <DropdownMenu>
              <DropdownItem on:click={doGLogin}>Google Login</DropdownItem>
              <DropdownItem on:click={doFBLogin}>Facebook Login</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        {/if}
        <NavItem>
          <NavLink href="https://saint-luke.net/">OSL</NavLink>
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>
</header>
<main>
  <ToastContainer let:data>
    <FlatToast {data} />
  </ToastContainer>
  <Router {routes} />
</main>

<footer class="footer mx-5">
  <p class="small text-end">
    This site uses cookies for authentication and analytics. <a
      href="/wado-privacy"
      target="new">Privacy Policy</a
    >
  </p>
  <p class="text-muted small text-end">
    Copyright &copy; <a href="https://saint-luke.net/">
      The Order of St. Luke &reg;
    </a> 2022. All Rights Reserved. &nbsp;|&nbsp; Build date: __buildDate__
  </p>
  <p class="small text-end">
    <a href="https://www.facebook.com/groups/3354160484857281">
      WADO user group
    </a>&nbsp; | &nbsp;
    <a href="https://github.com/cloudkucooland/wado-firebase"> GitHub </a>
  </p>
</footer>
<GdprBanner
  description="WADO uses cookies to for authentication and analytics"
  cookieName="wadogdpr"
  {choices}
  on:analytics={initAnalytics}
  {showEditIcon}
/>

<style>
  .text-muted {
    font-weight: normal;
  }
</style>
