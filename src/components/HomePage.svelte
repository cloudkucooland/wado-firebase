<script lang="ts">
	import {
		Heading as FBHeading,
		Tabs,
		TabItem,
		Input,
		Modal,
		Button,
		Datepicker
	} from 'flowbite-svelte';
	import proper from '../model/proper';
	import { auth, screenView, db, recordEvent } from '../firebase';
	import { getOffice, currentOffice } from '../model/offices';
	import { toasts } from 'svelte-toasts';
	import { getContext, setContext, onMount, onDestroy } from 'svelte';
	import { push, replace } from 'svelte-spa-router';
	import type User from '../../types/model/user';
	import type prayer from '../../types/model/prayer';
	import association from '../model/association';
	import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
	import { prefs } from '../model/preferences.svelte';

	const now: Date = new Date();
	const nowString: string = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

	let { params = { officeName: currentOffice(), officeDate: nowString } } = $props();
	let forProper = $derived(proper.fromDate(params.officeDate));
	setContext('forProper', {
		get details() {
			return forProper;
		},
		set details(v) {
			forProper = v;
		}
	});
	setContext('officeDate', {
		get value() {
			return params.officeDate;
		}
	});

	let officeName = $derived(params.officeName);
	let office = $derived(getOffice(officeName));
	let OfficeComp = $derived(office);

	const userContext = getContext<{ details: user }>('me');

	onMount((): void => {
		replace('/office/' + officeName + '/' + params.officeDate);
		screenView(officeName);
		window.addEventListener('scroll', scrolling);
		window.addEventListener('keypress', keypress);
	});

	onDestroy((): void => {
		window.removeEventListener('scroll', scrolling);
		window.removeEventListener('keypress', keypress);
	});

	// keyboard shortcuts, A to show alt, L to show edit links
	function keypress(e: KeyboardEvent): void {
		// Check for Alt toggle
		if (e.code === 'KeyA') {
			prefs.showAlt = !prefs.showAlt;
			// The simple ternary makes the toast logic cleaner
			const status = prefs.showAlt ? 'yes' : 'no';
			toasts.success('Show Alternatives', status);
		}

		// Check for Edit Links toggle
		if (e.code === 'KeyL') {
			prefs.showEdit = !prefs.showEdit;
			const status = prefs.showEdit ? 'yes' : 'no';
			toasts.success('Show Edit Links', status);
		}
	}

	function tabSwitch(o: string): void {
		push('/office/' + o + '/' + params.officeDate);
		return;
	}

	$effect(() => {
		// This runs whenever officeName changes
		screenView(officeName);
	});

	async function scrolling(e: Event): Promise<void> {
		if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
			if (!auth.currentUser) return;
			if (userContext.details.UpdateStreak) {
				const res = await userContext.details.UpdateStreak();
				toasts.success('Daily Streak', res);
				window.removeEventListener('scroll', scrolling);
			}
		}
	}

	function offices(weekday: number): Array<string> {
		if (weekday == 6) {
			return new Array('Lauds', 'Terce', 'Sext', 'None', 'Vigil');
		}
		return new Array('Lauds', 'Terce', 'Sext', 'None', 'Vespers', 'Compline');
	}
</script>

<svelte:head>
	<title>WADO: {officeName}: {forProper.propername}</title>
</svelte:head>

<div class={forProper.season}>
	<div class="flex">
		<Tabs class="flex-1">
			{#each offices(forProper.weekday) as o}
				<TabItem title={o} open={officeName == o} onclick={() => tabSwitch(o)} />
			{/each}
		</Tabs>
		<Datepicker
			class="flex-1"
			onselect={(d) => {
				const subs = d.toISOString().split('T');
				if (params.officeDate == subs[0]) return;
				forProper = proper.fromDate(subs[0]);
				push('/office/' + officeName + '/' + subs[0]);
			}}
		/>
		<div class="flex-1">&nbsp;</div>
	</div>

	<div class="max-w-200">
		<FBHeading tag="h3" class="text-center">{officeName}: {forProper.propername}</FBHeading>
		<div class="main">
			<OfficeComp />
		</div>
	</div>
</div>
