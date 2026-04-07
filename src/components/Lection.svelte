<script lang="ts">
	import { collection, query, where } from 'firebase/firestore';
	import { db, getDocsCacheFirst } from '../firebase';
	import season from '../model/season';
	import { getContext } from 'svelte';
	import type Proper from '../model/proper'; // Pointing to your actual model
	import lection from '../model/lection';
	import { Heading as FBHeading, Spinner } from 'flowbite-svelte';

	let { office } = $props<{ office: string }>();
	const properContext = getContext<{ details: Proper }>('forProper');

	async function loaddata(p: Proper): Promise<lection> {
		const s = season.LUT.get(p.season);
		if (!s) throw new Error('Invalid season');

		const wheres = [];
		wheres.push(where('season', '==', p.season));

		if (s.maxProper > 0 && p.proper >= 0) {
			wheres.push(where('proper', '==', p.proper));
		}

		if (s.useWeekdays && p.weekday >= 0) {
			wheres.push(where('weekday', '==', p.weekday));
		}

		const q = query(collection(db, 'lections', p.year, 'l'), ...wheres);
		const res = await getDocsCacheFirst(q);

		if (res.empty) {
			return new lection({
				_morning: 'No passage set for today, consult the lectionary',
				_evening: 'No passage set for today, consult the lectionary'
			});
		}
		return new lection(res.docs[0].data());
	}
</script>

{#await loaddata(properContext.details)}
	<Spinner />
{:then data}
	{#if office === 'LAUDS'}
		{#if data.morningtitle}
			<FBHeading tag="h5">{data.morning}: {data.morningtitle}</FBHeading>
		{/if}
		{#if data._morning}
			<p>{@html data._morning}</p>
		{:else}
			<p>
				<a
					href="https://www.biblegateway.com/passage/?search={data.morning}&version=NRSVUE"
					target="_blank"
				>
					{data.morning}
				</a>
			</p>
		{/if}
	{:else}
		{#if data.eveningtitle}
			<FBHeading tag="h5">{data.evening}: {data.eveningtitle}</FBHeading>
		{/if}
		{#if data._evening}
			<p>{@html data._evening}</p>
		{:else}
			<p>
				<a
					href="https://www.biblegateway.com/passage/?search={data.evening}&version=NRSVUE"
					target="_blank"
				>
					{data.evening}
				</a>
			</p>
		{/if}
	{/if}
{:catch error}
	<h5 class="text-red-500">Unable to load: {error.message}</h5>
{/await}

<style>
	p {
		font-family: Georgia, serif;
		line-height: 1.25em;
		word-wrap: break-word;
		margin-bottom: 1rem;
	}
</style>
