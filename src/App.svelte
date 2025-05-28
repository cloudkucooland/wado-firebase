<script lang="ts">
	import './app.css';
	import Router from 'svelte-spa-router';
	import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';

	// import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "sveltestrap";

	import {
		Footer,
		FooterCopyright,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem
	} from 'flowbite-svelte';

	import { recordEvent, auth, initAnalytics } from './firebase';

	import {
		FacebookAuthProvider,
		GoogleAuthProvider,
		signInWithPopup,
		signOut,
		onAuthStateChanged
	} from 'firebase/auth';

	import { setContext } from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import user from './model/user';
	import HomePage from './components/HomePage.svelte';
	import Settings from './components/Settings.svelte';
	import Users from './components/Users.svelte';
	import Search from './components/Search.svelte';
	import Edit from './components/Edit.svelte';
	import EditLocation from './components/EditLocation.svelte';
	import PrayerList from './components/PrayerList.svelte';
	import LectionList from './components/LectionList.svelte';
	import AddPrayer from './components/AddPrayer.svelte';
	import '@beyonk/gdpr-cookie-consent-banner/banner.css';
	import GdprBanner from '@beyonk/gdpr-cookie-consent-banner';

	const choices = {
		necessary: {
			label: 'Necessary cookies',
			description: "Used for cookie control. Can't be turned off.",
			value: true
		},
		tracking: false,
		analytics: {
			label: 'Analytics cookies',
			description:
				'Used to control Google Analytics, a 3rd party tool offered by Google which provides metrics used to improve WADO.',
			value: true
		},
		marketing: false
	};

	const showEditIcon = false;

	const routes = {
		'/': HomePage,
		'/office/:officeName/:officeDate': HomePage,
		'/settings': Settings,
		'/search': Search,
		'/users': Users,
		'/edit/:id': Edit,
		'/editlocation/:id': EditLocation,
		'/prayers/:c': PrayerList,
		'/addPrayer': AddPrayer,
		'/lectionary/:y': LectionList,
		'*': HomePage
	};

	let loggedIn = false;
	let me: Writable<user> = writable(new user({}));

	setContext('me', me);

	onAuthStateChanged(auth, async (u) => {
		console.log('authStateChanged', u);

		if (u.hasOwnProperty('uid')) {
			loggedIn = true;
			$me = await user.me();
			await $me.logAction();
			if ($me.isEditor) toasts.info('Editor permissions', u.displayName);
		} else {
			loggedIn = false;
		}
	});

	async function doFBLogin(): Promise<void> {
		try {
			await signInWithPopup(auth, new FacebookAuthProvider());
			loggedIn = true;
			recordEvent('Facebook login');
		} catch (err) {
			toasts.error(err.message);
			console.log(err);
		}
	}

	async function doGLogin(): Promise<void> {
		try {
			await signInWithPopup(auth, new GoogleAuthProvider());
			loggedIn = true;
			recordEvent('Google login');
		} catch (err) {
			toasts.error(err.message);
			console.log(err);
		}
	}

	async function doLogout(): Promise<void> {
		try {
			await signOut(auth);
			loggedIn = false;
			recordEvent('log out');
			toasts.success('logged out');
		} catch (err) {
			toasts.error(err.messasge);
			console.log(err);
		}
	}

	function startNotification(): void {
		if (typeof Notification === 'undefined') return;

		if (Notification.permission === 'default') {
			const tp = toasts.success('WADO Reminders', 'Click to allow WADO to send reminders to pray', {
				onClick: () => {
					Promise.resolve(Notification.requestPermission()).then((p) => {
						console.log('granted notification permission', p);
					});

					tp.remove();
				},
				duration: 0
			});
		}
	}

	if ('serviceWorker' in navigator) {
		let found = false;

		navigator.serviceWorker.getRegistrations().then((registrations) => {
			registrations.forEach((r) => {
				if (
					r.active.scriptURL == 'https://saint-luke.net/wado/service-worker.js' &&
					r.active.state == 'activated'
				) {
					found = true;
					r.update();
				}
			});
		});

		if (!found) {
			navigator.serviceWorker.register('service-worker.js');
		}

		startNotification();
	}
</script>

<svelte:head></svelte:head>

<header>
	<Navbar>
		<NavBrand href="/wado/#/"
			><img src="ox.svg" height="64" width="64" alt="current office" /></NavBrand
		>
		<NavHamburger />
		<NavUl>
			{#if loggedIn}
				<NavLi class="cursor-pointer">
					Tools <ChevronDownOutline class="text-primary-800 ms-2 inline h-6 w-6" />
				</NavLi>
				<Dropdown>
					<DropdownItem href="#/search">Search</DropdownItem>
					<DropdownItem href="#/editlocation/UNSET">Location List</DropdownItem>
					<DropdownItem href="#/prayers/prayer">Prayer List</DropdownItem>
					<DropdownItem href="#/lectionary/A">Lectionary</DropdownItem>
					<DropdownItem href="#/addPrayer">Add a Prayer</DropdownItem>
					<DropdownItem href="#/users">Recent Users</DropdownItem>
				</Dropdown>
				<NavLi href="#/settings" class="cursor-pointer">Settings</NavLi>
				<NavLi href="#" on:click={doLogout} class="cursor-pointer">Log Out</NavLi>
			{:else}
				<NavLi class="cursor-pointer">
					Login <ChevronDownOutline class="text-primary-800 ms-2 inline h-6 w-6" />
				</NavLi>
				<Dropdown>
					<DropdownItem on:click={doGLogin}>Google Login</DropdownItem>
					<DropdownItem on:click={doFBLogin}>Facebook Login</DropdownItem>
				</Dropdown>
			{/if}
			<NavLi href="https://saint-luke.net/">OSL</NavLi>
		</NavUl>
	</Navbar>
</header>
<main>
	<ToastContainer let:data>
		<FlatToast {data} />
	</ToastContainer>
	<Router {routes} />
</main>

<Footer class="start-0 bottom-0 border-t py-2.5 sm:px-4">
	<p class="small text-end">
		This site uses cookies for authentication and analytics. <a href="/wado-privacy" target="new"
			>Privacy Policy</a
		>
	</p>
	<FooterCopyright href="https://saint-luke.net/" by="The Order of St. Luke ®" year={2025} />
	<p class="small text-end">Build date: __buildDate__</p>
	<p class="small text-end">
		<a href="https://www.facebook.com/groups/3354160484857281"> WADO user group </a>&nbsp; | &nbsp;
		<a href="https://github.com/cloudkucooland/wado-firebase"> GitHub </a>
	</p>
</Footer>
<GdprBanner
	description="WADO uses cookies for authentication and analytics"
	cookieName="wadogdpr"
	{choices}
	on:analytics={initAnalytics}
	{showEditIcon}
/>
