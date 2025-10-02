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
	import { getContext, setContext, onMount, onDestroy, afterUpdate } from 'svelte';
	import { push, replace } from 'svelte-spa-router';
	import { type Writable, type Readable, writable } from 'svelte/store';
	import type User from '../../types/model/user';
	import type prayer from '../../types/model/prayer';
	import association from '../model/association';
	import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
	import { showEdit, showAlt } from '../model/preferences';

	const now: Date = new Date();
	const nowString: string = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

	export let params = { officeName: currentOffice(), officeDate: nowString };
	const properFromDate = proper.fromDate(params.officeDate);
	let forProper: Writable<proper> = writable(properFromDate);
	setContext('forProper', forProper);
	setContext('officeDate', params.officeDate); // only used by OSLCommemorations

	$: officeName = params.officeName;
	$: office = getOffice(officeName);

	let me: Readable<User> = getContext('me');

	onMount((): void => {
		// set the URL so that "poking the ox" always takes you to "now"
		replace('/office/' + officeName + '/' + params.officeDate);
		screenView(officeName);

		window.addEventListener('scroll', scrolling, { passive: true });
		window.addEventListener('keypress', keypress, { passive: true });
	});

	onDestroy((): void => {
		window.removeEventListener('scroll', scrolling, { passive: true });
		window.removeEventListener('keypress', keypress, { passive: true });
	});

	// keyboard shortcuts, A to show alt, L to show edit links
	function keypress(e: Event): void {
		if (e.code == 'KeyA') {
			showAlt.set(!$showAlt);
			let on = 'yes';
			if ($showAlt == false) on = 'no';
			toasts.success('Show Alternatives', on);
		}
		if (e.code == 'KeyL') {
			showEdit.set(!$showEdit);
			let on = 'yes';
			if ($showEdit == false) on = 'no';
			toasts.success('Show Edit Links', on);
		}
	}

	function tabSwitch(o: string): void {
		push('/office/' + o + '/' + params.officeDate);
		return;
	}

	afterUpdate((): void => {
		screenView(officeName);
	});

	async function scrolling(e: Event): Promise<void> {
		e.stopPropagation();
		if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
			if (!auth.currentUser) return;
			window.removeEventListener('scroll', scrolling, { passive: true });
			if ($me.UpdateStreak) {
				const res = await $me.UpdateStreak();
				toasts.success('Daily Streak', res);
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
	<title>WADO: {officeName}: {$forProper.propername}</title>
</svelte:head>

<div class={$forProper.season}>
	<div class="flex">
		<Tabs class="flex-1">
			{#each offices($forProper.weekday) as o}
				<TabItem title={o} open={officeName == o} onclick={() => tabSwitch(o)} />
			{/each}
		</Tabs>
		<Datepicker
			class="flex-1"
			onselect={(d) => {
				const subs = d.toISOString().split('T');
				if (params.officeDate == subs[0]) return;
				$forProper = proper.fromDate(subs[0]);
				push('/office/' + officeName + '/' + subs[0]);
			}}
		/>
		<div class="flex-1">&nbsp;</div>
	</div>

	<div class="max-w-200">
		<FBHeading tag="h3" class="text-center">{officeName}: {$forProper.propername}</FBHeading>
		<div class="main">
			<svelte:component this={office} />
		</div>
	</div>
</div>
