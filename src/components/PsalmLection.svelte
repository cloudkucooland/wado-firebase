<script lang="ts">
	import { collection, query, where, doc } from 'firebase/firestore';
	import { db, getDocCacheFirst, getDocsCacheFirst } from '../firebase';
	import season from '../model/season';
	import Psalm from './prayerClasses/Psalm.svelte';
	import { toasts } from 'svelte-toasts';
	import { getContext } from 'svelte';
	import type Proper from '../model/proper';
	import type { lectionFromFirestore, prayerFromFirestore } from '../model/types';
	import { Spinner } from 'flowbite-svelte';

	// 1. Svelte 5 Props
	let { office, gloria } = $props<{ office: string; gloria: boolean }>();

	// 2. Consume the new context structure
	const properContext = getContext<{ details: Proper }>('forProper');

	// Inline class for data handling (kept for logic consistency)
	class plClass {
		id: string;
		morningpsalm: string;
		eveningpsalm: string;
		_morningpsalmref: string | null;
		_eveningpsalmref: string | null;
		_resolved?: prayerFromFirestore;

		constructor(obj: lectionFromFirestore & { id?: string }) {
			this.id = obj.id || 'unknown';
			this.morningpsalm = obj.morningpsalm || '';
			this.eveningpsalm = obj.eveningpsalm || '';
			this._morningpsalmref = obj._morningpsalmref || null;
			this._eveningpsalmref = obj._eveningpsalmref || null;
		}
	}

	async function loaddata(p: Proper): Promise<plClass> {
		const s = season.LUT.get(p.season);
		if (!s) throw new Error('Invalid Season');

		const wheres = [where('season', '==', p.season)];
		if (s.maxProper > 0 && p.proper >= 0) wheres.push(where('proper', '==', p.proper));
		if (s.useWeekdays && p.weekday >= 0) wheres.push(where('weekday', '==', p.weekday));

		const q = query(collection(db, 'lections', p.year, 'l'), ...wheres);
		const res = await getDocsCacheFirst(q);

		if (res.empty) {
			return new plClass({
				id: 'Empty Result...',
				morningpsalm: 'Psalm 1',
				eveningpsalm: 'Psalm 150'
			});
		}

		const d = new plClass(res.docs[0].data() as lectionFromFirestore);
		const isLauds = office === 'LAUDS';
		const ref = isLauds ? d._morningpsalmref : d._eveningpsalmref;

		// 3. Resolution logic: Try to fetch the full Psalm text if a reference exists
		if (ref) {
			try {
				const ps = doc(db, 'prayers', ref);
				const psalmDoc = await getDocCacheFirst(ps);
				d._resolved = psalmDoc.data() as prayerFromFirestore;
				d.id = ref;
			} catch (err: any) {
				console.error(err);
				toasts.error(`Psalm resolution failed: ${err.message}`);
			}
		}
		return d;
	}
</script>

{#await loaddata(properContext.details)}
	<Spinner />
{:then data}
	{#if data._resolved}
		<Psalm data={data._resolved} id={data.id} {gloria} />
	{:else}
		{@const currentPsalm = office === 'LAUDS' ? data.morningpsalm : data.eveningpsalm}
		{#if currentPsalm}
			<p class="psalm-link">
				<a
					href="https://www.biblegateway.com/passage/?search={currentPsalm}&version=NRSVUE"
					target="_blank"
					rel="noopener noreferrer"
				>
					{currentPsalm}
				</a>
			</p>
		{:else}
			<h5>No Psalm Specified for today</h5>
		{/if}
	{/if}
{:catch error}
	<h5 class="text-red-500">Unable to load psalms: {error.message}</h5>
{/await}

<style>
	.psalm-link {
		font-family: Georgia, serif;
		margin-top: 1rem;
	}
</style>
