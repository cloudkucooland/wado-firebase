<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		Input,
		Button,
		Tabs,
		TabItem,
		Modal,
		Heading as FBHeading
	} from 'flowbite-svelte';
	import { collection, query, where, limit, doc, addDoc, setDoc } from 'firebase/firestore';
	import { db, recordEvent, screenView, getDocsCacheFirst } from '../firebase';
	import proper from '../model/proper';
	import { onMount, getContext } from 'svelte';
	import { toasts } from 'svelte-toasts';
	import { link } from 'svelte-spa-router';
	import lection from '../model/lection';
	import type { Readable } from 'svelte/store';
	import type User from '../../types/model/user';

	// @ts-ignore
	export let params = { y };
	$: year = params.y ? params.y : 'A';
	const _ll: Map<string, [proper, lection]> = new Map();
	$: lections = _ll;
	let me: Readable<User> = getContext('me');

	class mdClass {
		morning?: string;
		evening?: string;
		morningtitle?: string;
		eveningtitle?: string;
		morningpsalm?: string;
		eveningpsalm?: string;
		season?: string;
		proper?: number;
		weekday?: number;
		key?: string;
		path?: string;
		_morningpsalmref?: string;
		_eveningpsalmref?: string;

		constructor(obj: any) {
			if (obj.morning) this.morning = obj.morning;
			if (obj.evening) this.evening = obj.evening;
			if (obj.morningtitle) this.morningtitle = obj.morningtitle;
			if (obj.eveningtitle) this.eveningtitle = obj.eveningtitle;
			if (obj.morningpsalm) this.morningpsalm = obj.morningpsalm;
			if (obj.eveningpsalm) this.eveningpsalm = obj.eveningpsalm;
			if (obj.season) this.season = obj.season;
			if (typeof obj.proper == 'number') {
				this.proper = obj.proper;
			} else {
				console.debug('forcing proper');
				obj.proper = 0;
			}
			if (typeof obj.weekday == 'number') {
				this.weekday = obj.weekday;
			} else {
				console.debug('forcing weekday');
				obj.weekday = 0;
			}
			if (obj.key) this.key = obj.key;
			if (obj.path) this.path = obj.path;
			if (obj._morningpsalmref) this._morningpsalmref = obj._morningpsalmref;
			if (obj._eveningpsalmref) this._eveningpsalmref = obj._eveningpsalmref;
		}
	}
	const _md: mdClass = new mdClass({});
	$: modalData = _md;

	async function loadLections(y: string): Promise<Map<string, [proper, lection]>> {
		let progressBarString = 'starting';
		const progressBar = toasts.success('Loading Data', progressBarString, {
			duration: 0
		});

		const ay: Map<string, proper> = proper.AllYear(y);
		const out: Map<string, [proper, lection]> = new Map();
		const empty: lection = new lection({});

		let i = 0;
		for (const [k, v] of ay) {
			out.set(k, [v, empty]);
			progressBarString = i.toString();
			progressBar.update({
				title: 'Loading data',
				description: progressBarString
			});
			i = i + 1;

			try {
				const q = query(
					collection(db, 'lections', y, 'l'),
					where('season', '==', v.season),
					where('weekday', '==', v.weekday),
					where('proper', '==', v.proper),
					limit(1)
				);
				const res = await getDocsCacheFirst(q);
				for (const a of res.docs) {
					const n = a.data();
					const newLection: lection = new lection(n);
					newLection.path = a.ref.path; // kludge
					out.set(k, [v, newLection]);
				}
			} catch (err: Error) {
				toasts.error(err.message);
				console.log(err);
			}
		}
		progressBar.remove();
		return out;
	}

	onMount(async () => {
		lections = await loadLections(year);
		screenView('Lection List');
	});

	$: lectionModalOpen = false;
	async function toggleLectionModalOpen(e: Event): Promise<void> {
		screenView('lectionModalOpen');
		lectionModalOpen = !lectionModalOpen;

		// discard the caches, do not copy them here
		if (lectionModalOpen) {
			const t = e.target as HTMLInputElement;
			console.debug(t.value);
			const [p, l] = lections.get(t.value);
			modalData = new mdClass({
				morning: l.morning,
				evening: l.evening,
				morningpsalm: l.morningpsalm,
				eveningpsalm: l.eveningpsalm,
				morningtitle: l.morningtitle,
				eveningtitle: l.eveningtitle,
				season: p.season,
				proper: p.proper,
				weekday: p.weekday,
				path: l.path, // kludge
				key: t.value
			});
		}
		console.debug(modalData);
	}

	async function confirmLectionModal(): Promise<void> {
		recordEvent('edit_lection', { key: modalData.key });
		lectionModalOpen = !lectionModalOpen;

		// do not write the cached data back, refetch it
		// firebase only accepts generic objects
		const data: object = {
			morning: modalData.morning,
			morningpsalm: modalData.morningpsalm,
			morningtitle: modalData.morningtitle,
			evening: modalData.evening,
			eveningpsalm: modalData.eveningpsalm,
			eveningtitle: modalData.eveningtitle,
			season: modalData.season,
			proper: modalData.proper,
			weekday: modalData.weekday
		};
		// console.debug('to bare object', data);

		// try to link to the formatted psalms
		try {
			let q = query(
				collection(db, 'prayers'),
				where('Class', '==', 'psalm'),
				where('Name', '==', modalData.morningpsalm)
			);
			let res = await getDocsCacheFirst(q);
			for (const a of res.docs) {
				// @ts-ignore
				data._morningpsalmref = a.id;
			}

			q = query(
				collection(db, 'prayers'),
				where('Class', '==', 'psalm'),
				where('Name', '==', modalData.eveningpsalm)
			);
			res = await getDocsCacheFirst(q);
			for (const a of res.docs) {
				// @ts-ignore
				data._eveningpsalmref = a.id;
			}
		} catch (err: Error) {
			console.log(err);
			toasts.error(err.message);
		}

		// send to firestore
		// console.debug('after refs', data);
		try {
			if (modalData.path == '' || typeof modalData.path == 'undefined') {
				const added = await addDoc(collection(db, 'lections', year, 'l'), data);
				modalData.path = added.path;
			} else {
				await setDoc(doc(db, modalData.path), data);
			}
			const _p: proper = new proper(modalData);
			const _l: lection = new lection(modalData);
			console.debug(_p, _l);
			lections.set(modalData.key, [_p, _l]);
			toasts.success('lection saved');
			lections = lections; // force svelte update
		} catch (err: Error) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	async function tabSwitch(y): Promise<void> {
		if (y == year) return;
		lections = new Map();
		year = y;
		document.location.assign('#/lectionary/' + year);
		lections = await loadLections(year);
	}
</script>

<svelte:head>
	<title>WADO Lectionary Editor: Year {year}</title>
</svelte:head>

<div class="w-full grid-flow-row-dense grid-cols-12">
	<div class="w-full items-center">
		<FBHeading tag="h2">Lectionary Editor: Year {year}</FBHeading>
	</div>

	<Tabs class="flex-auto">
		{#each ['A', 'B', 'C'] as y}
			<TabItem title="Year {y}" open={year == y} onclick={(e) => tabSwitch(y)} />
		{/each}
	</Tabs>
	<Table class="w-full">
		<TableBody>
			{#each [...lections] as [k, v]}
				<TableBodyRow>
					<TableBodyCell colspan="3">
						{#if $me.isEditor}
							<Button color="red" onclick={toggleLectionModalOpen} value={k}>{k}</Button>
						{:else}
							<strong class="mb-0">{k}</strong>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell>
						<strong>Morning Psalm:</strong>
						{#if v[1]._morningpsalmref}
							<em
								><a
									href="/edit/{v[1]._morningpsalmref}"
									target="_blank"
									use:link
									rel="noopener noreferrer">{v[1].morningpsalm}</a
								></em
							>
						{:else}
							{v[1].morningpsalm}
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						<strong>Morning:</strong>
						{#if v[1]._morning}
							<em>{v[1].morning}</em>
						{:else}
							{v[1].morning}
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						<strong>Morning Title:</strong>
						{v[1].morningtitle}
					</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell>
						<strong>Evening Psalm:</strong>
						{#if v[1]._eveningpsalmref}
							<em
								><a
									href="/edit/{v[1]._eveningpsalmref}"
									use:link
									target="_blank"
									rel="noopener noreferrer">{v[1].eveningpsalm}</a
								></em
							>
						{:else}
							{v[1].eveningpsalm}
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						<strong>Evening:</strong>
						{#if v[1]._evening}
							<em>{v[1].evening}</em>
						{:else}
							{v[1].evening}
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						<strong>Evening Title:</strong>
						{v[1].eveningtitle}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<Modal id="lectionModal" bind:open={lectionModalOpen} size="xl">
	<FBHeading tag="h3">Edit Lection: {modalData.key}</FBHeading>
	<div>
		M Psalm: <Input bind:value={modalData.morningpsalm} />
		M: <Input bind:value={modalData.morning} />
		M Title: <Input bind:value={modalData.morningtitle} />
		E Psalm: <Input bind:value={modalData.eveningpsalm} />
		E: <Input bind:value={modalData.evening} />
		E Title: <Input bind:value={modalData.eveningtitle} />
	</div>
	<div>
		<Button color="red" size="sm" onclick={toggleLectionModalOpen}>Cancel</Button>
		<Button color="green" size="sm" onclick={confirmLectionModal}>Confirm</Button>
	</div>
</Modal>
