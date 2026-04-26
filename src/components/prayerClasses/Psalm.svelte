<script lang="ts">
	import { prefs } from '../../model/preferences.svelte';
	import Media from '../Media.svelte';
	import psalm from '../../model/psalm';
	import type { prayerFromFirestore } from '../../model/types';
	import { Heading } from 'flowbite-svelte';
	import { EditSolid } from 'flowbite-svelte-icons';
	import { push } from 'svelte-spa-router';
	import { toasts } from 'svelte-toasts';
	import Antiphon from './Antiphon.svelte';
	import Location from '../Location.svelte';
	import { getDoc } from 'firebase/firestore';

	// 1. Use $props() for Svelte 5 reactivity
	let {
		data,
		id,
		gloria = false,
		bold = false,
		subunit = null
	} = $props<{
		data: prayerFromFirestore;
		id: string;
		gloria?: boolean;
		bold?: boolean;
		subunit?: string | null;
	}>();

	// 2. Use $derived to recreate the psalm object if data changes
	const p = $derived(new psalm(data));

	// 3. Use $state for these values
	let antiphon = $state<prayerFromFirestore | null>(null);
	let antID = $state<string>('');

	// 4. Use $effect to handle the async lookup reactively
	$effect(() => {
		if (data.Antiphon) {
			// or p.antiphon depending on your model
			getDoc(data.Antiphon)
				.then((snap) => {
					antID = snap.id;
					antiphon = snap.data() as prayerFromFirestore;
				})
				.catch((err) => {
					toasts.error(err.message);
				});
		}
	});
</script>

<Heading tag="h5">
	{p.name}
	{#if prefs.showEdit}
		<span class="ml-2 inline-flex items-center">
			<button
				onclick={() => push('#/edit/' + id)}
				class="rounded bg-gray-100 p-1 text-gray-400 hover:text-blue-500 dark:bg-gray-800"
				title="Edit Psalm"
				aria-label="Edit Psalm"
			>
				<EditSolid size="xs" />
			</button>
		</span>
	{/if}
</Heading>

{#if p.rubric}
	<div class="psalm-rubric">{p.rubric}</div>
{/if}

{#if antiphon}
	<div><Antiphon data={antiphon} id={antID} /></div>
	<br />
{/if}

<div class="psalm">{@html p.body}</div>

{#if p.author}
	<div class="psalm-credit">{p.author}</div>
{/if}

<Media mediaUrl={p.media} />

{#if gloria}
	<Location name="GENERAL-GLORIA" />
{/if}

{#if antiphon}
	<Antiphon data={antiphon} id={antID} />
{/if}
