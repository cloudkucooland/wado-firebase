<script lang="ts">
	import { Input, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { index } from '../meili';
	import { toasts } from 'svelte-toasts';
	import { recordEvent } from '../firebase';
	// import { link } from "svelte-spa-router"; // fails on subsequent queries?
	import type { SearchResponse } from '../../node_modules/meilisearch/dist/types/types/types';

	let result: SearchResponse = {
		hits: new Array(),
		processingTimeMs: 0,
		query: ''
	};

	const searchParams = {
		attributesToRetrieve: ['fsid', 'Name', 'Body', 'Class'],
		filter: [['Class = Prayer', 'Class = Hymn', 'Class = Antiphon']]
	};

	async function doSearchLetter(e: Event) {
		const t = e.target as HTMLInputElement;
		if (t.value.length < 4) return;

		try {
			result = await index.search(t.value, searchParams);
			recordEvent('search', {
				short: true,
				query: t.value,
				results: result.estimatedTotalHits
			});
		} catch (err) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	async function doSearch(e: Event) {
		const t = e.target as HTMLInputElement;
		try {
			result = await index.search(t.value, searchParams);
			toasts.success('Found ' + result.estimatedTotalHits, 'Displaying ' + result.hits.length);
			recordEvent('search', {
				short: false,
				query: t.value,
				results: result.estimatedTotalHits
			});
		} catch (err) {
			console.log(err);
			toasts.error(err.message);
		}
	}
</script>

<svelte:head>
	<title>WADO Prayer Search</title>
</svelte:head>

<div class="w-full">
	<h3>Search</h3>
	<Input on:change={doSearch} on:keypress={doSearchLetter} />
	<div>
		<strong>Results</strong>
		<Listgroup class="mb-5 shadow">
			{#each result.hits as r}
				<ListgroupItem>
					<strong>
						<a href="#/edit/{r.fsid}">{r.Name}</a>
						<span class="adonai">( {r.Class} )</span>
					</strong>
					<p>{@html r.Body}</p>
				</ListgroupItem>
			{/each}
		</Listgroup>
	</div>
</div>
