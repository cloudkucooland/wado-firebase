<script lang="ts">
	import './app.css';
	import Router from 'svelte-spa-router';
	import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';
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
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

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
	import user from './model/user.svelte';
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

	let me = $state(new user({}));
	let loggedIn = $derived(!!me.uid);
	setContext('me', {
		get details() {
			return me;
		}
	});

	onAuthStateChanged(auth, async (u) => {
		if (u) {
			me = await user.me();
			await me.logAction();
		} else {
			me = new user({});
		}
	});

	async function doFBLogin(): Promise<void> {
		try {
			await signInWithPopup(auth, new FacebookAuthProvider());
			recordEvent('Facebook login');
		} catch (err: any) {
			toasts.error(err.message);
			console.log(err);
		}
	}

	async function doGLogin(): Promise<void> {
		try {
			await signInWithPopup(auth, new GoogleAuthProvider());
			recordEvent('Google login');
		} catch (err: any) {
			toasts.error(err.message);
			console.log(err);
		}
	}

	async function doLogout(): Promise<void> {
		try {
			await signOut(auth);
			recordEvent('log out');
			toasts.success('logged out');
		} catch (err: any) {
			toasts.error(err.message);
			console.log(err);
		}
	}

	function startNotification(): void {
		if (typeof Notification === 'undefined' || Notification.permission !== 'default') return;

		const tp = toasts.success('WADO Reminders', 'Click to allow WADO to send reminders to pray', {
			onClick: async () => {
				const permission = await Notification.requestPermission();
				if (permission === 'granted') {
					const reg = await navigator.serviceWorker.ready;
					reg.active?.postMessage({ eventType: 'reset' });
				}
				tp.remove();
			},
			duration: 0
		});
	}

	if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
		navigator.serviceWorker.register('service-worker.js').then(() => startNotification());
	}
</script>

<svelte:head></svelte:head>

<header class="w-full justify-start p-0">
	<Navbar
		class="sticky top-0 z-50 border-b border-gray-200 bg-white/90 p-0 backdrop-blur-md sm:px-0 dark:border-slate-800 dark:bg-slate-900/90"
		aria-label="Main Navigation"
	>
		<NavBrand href="/wado/#/" class="p-0" aria-label="WADO Home">
			<img src="ox.svg" height="72" width="72" alt="The Winged and Docile Ox" class="me-3" />
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
				>Web-Amplified Daily Office</span
			>
		</NavBrand>
		<NavHamburger class="p-0 sm:px-0" />
		<NavUl class="p-0 sm:px-0">
			{#if loggedIn}
				<NavLi class="cursor-pointer">
					Tools <ChevronDownOutline />
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
				<NavLi href="#" onclick={doLogout} class="cursor-pointer">Log Out</NavLi>
			{:else}
				<NavLi class="cursor-pointer">
					Login <ChevronDownOutline class="text-primary-800 ms-2 inline h-6 w-6" />
				</NavLi>
				<Dropdown>
					<DropdownItem onclick={doGLogin}>Google Login</DropdownItem>
					<DropdownItem onclick={doFBLogin}>Facebook Login</DropdownItem>
				</Dropdown>
			{/if}
			<NavLi href="https://saint-luke.net/">The Order of Saint Luke ®</NavLi>
		</NavUl>
	</Navbar>
</header>
<main class="min-h-screen transition-colors duration-300">
	<ToastContainer let:data>
		<FlatToast {data} />
	</ToastContainer>
	<Router {routes} />
</main>

<Footer
	class="border-t border-gray-200 bg-gray-50 p-4 text-gray-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
>
	<div class="w-full">
		<FooterCopyright
			href="https://saint-luke.net/"
			by="The Order of St. Luke ®"
			year={new Date().getFullYear()}
		/>
		This site uses cookies for authentication and analytics.<br />
	</div>
	<div>
		<a href="/wado-privacy" target="new">Privacy Policy</a> |
		<a href="https://www.facebook.com/groups/3354160484857281">WADO user group</a> |
		<a href="https://github.com/cloudkucooland/wado-firebase">GitHub</a> <br />
		Build date: {__buildDate__}
	</div>
</Footer>

<GdprBanner
	description="WADO uses cookies for authentication and analytics"
	cookieName="wadogdpr"
	{choices}
	on:analytics={(e) => initAnalytics(e.detail)}
	{showEditIcon}
/>
