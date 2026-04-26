<script lang="ts">
	import { collection, query, where, limit, orderBy, type Query } from 'firebase/firestore';
	import { db, getDocCacheFirst, getDocsCacheFirst } from '../firebase';
	import { prefs } from '../model/preferences.svelte';
	import { getContext } from 'svelte';
	import { push } from 'svelte-spa-router';
	import { Spinner } from 'flowbite-svelte';
	import { CalendarEditSolid } from 'flowbite-svelte-icons';
	import { toasts } from 'svelte-toasts';

	import Alternatives from './Alternatives.svelte';
	import Hymn from './prayerClasses/Hymn.svelte';
	import Prayer from './prayerClasses/Prayer.svelte';
	import Psalm from './prayerClasses/Psalm.svelte';
	import Antiphon from './prayerClasses/Antiphon.svelte';
	import Commemoration from './prayerClasses/Commemoration.svelte';
	import type Proper from '../model/proper';
	import type { prayerFromFirestore, associationFromFirestore } from '../model/types';

	let {
		name,
		max = 1,
		maxAlt = 0,
		bold = false,
		subunit = null,
		gloria = false
	} = $props<{
		name: string;
		max?: number;
		maxAlt?: number;
		bold?: boolean;
		subunit?: string | null;
		gloria?: boolean;
	}>();

	const forProper = getContext<{ details: Proper }>('forProper');

	const lookup: Record<string, any> = {
		other: Prayer,
		hymn: Hymn,
		prayer: Prayer,
		psalm: Psalm,
		antiphon: Antiphon,
		commemoration: Commemoration
	};

	let realMax = $derived.by(() => {
		const baseMax = Number(max);
		if (prefs.showAlt) {
			const altMax = Number(maxAlt);
			return altMax > baseMax ? altMax : baseMax;
		}
		return baseMax;
	});

	async function loaddata(p: Proper): Promise<Map<string, prayerFromFirestore>> {
		const m: Map<string, prayerFromFirestore> = new Map();
		const currentLimit = realMax;

		const doQuery = async (q: Query) => {
			try {
				const res = await getDocsCacheFirst(q);
				for (const a of res.docs) {
					if (m.size >= currentLimit) break;
					const ad = a.data() as associationFromFirestore;
					const d = await getDocCacheFirst(ad.Reference);
					const dd = d.data() as prayerFromFirestore;
					// Filter for licensed content
					if (dd.License) m.set(d.id, dd);
				}
			} catch (err: any) {
				console.error(err);
				toasts.error(err.message);
			}
		};

		const makeQuery = (overrides: Partial<associationFromFirestore>) => {
			const base = {
				Location: name,
				CalendarDate: 'Any',
				Season: 'Any',
				Proper: -1,
				Weekday: -1,
				Year: 'Any'
			};
			const qa = { ...base, ...overrides };

			return query(
				collection(db, 'associations'),
				where('Location', '==', qa.Location),
				where('CalendarDate', '==', qa.CalendarDate),
				where('Season', '==', qa.Season),
				where('Proper', '==', qa.Proper),
				where('Weekday', '==', qa.Weekday),
				where('Year', '==', qa.Year),
				orderBy('Weight'),
				limit(currentLimit - m.size)
			);
		};

		// 1. Exact Calendar Date (Feasts)
		await doQuery(
			query(
				collection(db, 'associations'),
				where('Location', '==', name),
				where('CalendarDate', '==', p.caldate),
				orderBy('Weight'),
				limit(currentLimit)
			)
		);
		if (m.size >= currentLimit) return m;

		// 2. Specific Proper/Year
		await doQuery(
			makeQuery({ season: p.season, proper: p.proper, weekday: p.weekday, year: p.year })
		);
		if (m.size >= currentLimit) return m;

		// 3. Specific Proper, Any Year
		await doQuery(makeQuery({ season: p.season, proper: p.proper, weekday: p.weekday }));
		if (m.size >= currentLimit) return m;

		// 4. Any Day of that Proper
		await doQuery(makeQuery({ season: p.season, proper: p.proper }));
		if (m.size >= currentLimit) return m;

		// 5. Any Proper of that Season/Weekday
		await doQuery(makeQuery({ season: p.season, weekday: p.weekday }));
		if (m.size >= currentLimit) return m;

		// 6. Any Day of that Season
		await doQuery(makeQuery({ season: p.season }));
		if (m.size >= currentLimit) return m;

		// 7.Location Default
		await doQuery(makeQuery({}));

		return m;
	}
</script>

{#await loaddata(forProper.details)}
	<div class="flex justify-center p-4">
		<Spinner />
	</div>
{:then data}
	{#if prefs.showEdit}
		<div
			class="mb-2 flex items-center gap-2 rounded bg-gray-100 p-1 text-xs text-gray-400 dark:bg-gray-800"
		>
			<span>Location: {name}</span>
			<button
				onclick={() => push('#/editlocation/' + name)}
				class="hover:text-blue-500"
				title="Edit Location"
				aria-label="Edit Location: {name}"
			>
				<CalendarEditSolid size="xs" />
			</button>
		</div>
	{/if}

	{#if maxAlt > 0 && prefs.showAlt && data.size > 1}
		<Alternatives {data} {bold} {subunit} {gloria} />
	{:else if data.size > 0}
		{#each [...data] as [id, d]}
			{@const PrayerComp = lookup[d.Class?.toLowerCase() || 'prayer']}
			{#if PrayerComp}
				<PrayerComp data={d} {id} {bold} {subunit} {gloria} />
			{/if}
		{/each}
	{:else if prefs.showAlt}
		<p class="text-xs text-red-400 italic">No content found for {name}</p>
	{/if}
{:catch error}
	<div class="rounded border border-red-500 bg-red-50 p-2 text-red-700">
		<p class="font-bold">Error loading {name}:</p>
		<p class="text-sm">{error.message}</p>
	</div>
{/await}
