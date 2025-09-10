<script lang="ts">
	import { collection, query, where, limit, orderBy } from 'firebase/firestore';
	import { db, getDocCacheFirst, getDocsCacheFirst } from '../firebase';
	import { showEdit, showAlt } from '../model/preferences';
	import { getContext } from 'svelte';
	import Alternatives from './Alternatives.svelte';
	import { link, push } from 'svelte-spa-router';
	import type { Readable } from 'svelte/store';
	import type proper from '../../types/model/proper';
	import { Spinner } from 'flowbite-svelte';
	import { CalendarEditSolid, CalendarPlusSolid } from 'flowbite-svelte-icons';

	import Hymn from './prayerClasses/Hymn.svelte';
	import Prayer from './prayerClasses/Prayer.svelte';
	import Psalm from './prayerClasses/Psalm.svelte';
	import Antiphon from './prayerClasses/Antiphon.svelte';
	import Commemoration from './prayerClasses/Commemoration.svelte';
	import type { prayerFromFirestore, associationFromFirestore } from '../model/types';

	let proper: Readable<proper> = getContext('forProper');
	let qaa: Readable<any> = getContext('qaa');

	export let name: string;
	export let max: number = 1;
	export let maxAlt: number = 0;
	export let bold: boolean = false;
	export let subunit: string;
	export let gloria: boolean = false; // passthrough for psalms

	export const lookup = new Map([
		['other', Prayer],
		['hymn', Hymn],
		['prayer', Prayer],
		['psalm', Psalm],
		['antiphon', Antiphon],
		['commemoration', Commemoration]
	]);

	if (typeof max !== 'number') max = +max;
	let realMax = max;
	if ($showAlt) {
		if (typeof maxAlt !== 'number') maxAlt = +maxAlt;
		realMax = maxAlt > max ? maxAlt : max;
	}

	// since firestore (currently) only supports one "in" or "inarray" operator, we can't flatten this out
	// this works for now
	async function loaddata(p: proper): Promise<Map<string, prayerFromFirestore>> {
		const m: Map<string, prayerFromFirestore> = new Map();

		// closure - needs m
		const doQuery = async (q) => {
			try {
				const res = await getDocsCacheFirst(q);
				for (const a of res.docs) {
					const ad = a.data() as associationFromFirestore;
					const d = await getDocCacheFirst(ad.Reference);
					const dd = d.data() as prayerFromFirestore;
					if (dd.License) m.set(d.id, dd);
				}
			} catch (err) {
				console.log(err);
				toasts.error(err.message);
			}
		};

		// just a wrapper to enforce types
		type queryArgs = {
			location: string;
			season: string;
			proper: number;
			weekday: number;
			year: string;
		};

		// just a wrapper to enforce types
		const makeQuery = (qa: queryArgs) => {
			return query(
				collection(db, 'associations'),
				where('Location', '==', qa.location),
				where('CalendarDate', '==', 'Any'),
				where('Season', '==', qa.season),
				where('Proper', '==', qa.proper),
				where('Weekday', '==', qa.weekday),
				where('Year', '==', qa.year),
				orderBy('Weight'),
				limit(realMax - m.size)
			);
		};

		// try with caldate
		await doQuery(
			query(
				collection(db, 'associations'),
				where('Location', '==', name),
				where('CalendarDate', '==', p.caldate),
				orderBy('Weight'),
				limit(realMax)
			)
		);
		if (m.size >= realMax) return m;

		// try with all the details
		await doQuery(
			makeQuery({
				location: name,
				season: p.season,
				proper: p.proper,
				weekday: p.weekday,
				year: p.year
			} as queryArgs)
		);
		if (m.size >= realMax) return m;

		// Any Year
		await doQuery(
			makeQuery({
				location: name,
				season: p.season,
				proper: p.proper,
				weekday: p.weekday,
				year: 'Any'
			} as queryArgs)
		);
		if (m.size >= realMax) return m;

		// Any Year or Day
		await doQuery(
			makeQuery({
				location: name,
				season: p.season,
				proper: p.proper,
				weekday: -1,
				year: 'Any'
			} as queryArgs)
		);
		if (m.size >= realMax) return m;

		// Season/Weekday
		await doQuery(
			makeQuery({
				location: name,
				season: p.season,
				proper: -1,
				weekday: p.weekday,
				year: 'Any'
			} as queryArgs)
		);
		if (m.size >= realMax) return m;

		// Season only
		await doQuery(
			makeQuery({
				location: name,
				season: p.season,
				proper: -1,
				weekday: -1,
				year: 'Any'
			} as queryArgs)
		);
		if (m.size >= realMax) return m;

		// Location, anys
		await doQuery(
			makeQuery({
				location: name,
				season: 'Any',
				proper: -1,
				weekday: -1,
				year: 'Any'
			} as queryArgs)
		);

		if (m.size == 0) console.debug('no results found for', name);
		return m;
	}
</script>

{#await loaddata($proper)}
	<Spinner />
{:then data}
	{#if $showEdit}
		<div class="edit">
			{name}
			<button
				on:click={() => {
					push('#/editlocation/' + name);
				}}
			>
				<CalendarEditSolid />
			</button>
			<button
				on:click={() => {
					$qaa(name);
				}}
			>
				<CalendarPlusSolid />
			</button>
		</div>
	{/if}
	{#if maxAlt > 0 && $showAlt && data.size > 1}
		<Alternatives {data} {bold} {subunit} {gloria} />
	{:else}
		{#each [...data] as [id, d]}
			<svelte:component this={lookup.get(d.Class)} data={d} {id} {bold} {subunit} {gloria} />
		{/each}
	{/if}
{:catch error}
	<h5>Unable to load: {error.message}</h5>
{/await}
