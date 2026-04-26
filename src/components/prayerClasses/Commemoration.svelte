<script lang="ts">
	import { prefs } from '../../model/preferences.svelte';
	import Media from '../Media.svelte';
	import commemoration from '../../model/commemoration';
	import type { prayerFromFirestore } from '../../model/types';
	import { Heading } from 'flowbite-svelte';
	import { EditSolid } from 'flowbite-svelte-icons';
	import { push } from 'svelte-spa-router';

	// 1. Destructure props using the $props rune
	let {
		data,
		id,
		bold = false,
		subunit = null,
		gloria = false
	} = $props<{
		data: prayerFromFirestore;
		id: string;
		bold?: boolean;
		subunit?: string | null;
		gloria?: boolean;
	}>();

	// 2. Wrap the class instance in $derived
	const c = $derived.by(() => {
		const instance = new commemoration(data);
		instance.id = id;
		return instance;
	});
</script>

{#if subunit === 'morningcollect' && c.morningcollect}
	{@html c.morningcollect}
	{#if c.author}<div class="prayer-credit">{c.author}</div>{/if}
{/if}

{#if subunit === 'eveningcollect' && c.eveningcollect}
	{@html c.eveningcollect}
	{#if c.author}<div class="prayer-credit">{c.author}</div>{/if}
{/if}

{#if !subunit}
	{#if prefs.showEdit}
		<div class="edit">
			<div
				class="mb-2 flex items-center gap-2 rounded bg-gray-100 p-1 text-xs text-gray-400 dark:bg-gray-800"
			>
				<button
					onclick={() => push('#/edit/' + id)}
					class="hover:text-blue-500"
					title="Edit Commemoration"
					aria-label="Edit Commemoration"
				>
					<EditSolid size="xs" />
				</button>
			</div>
		</div>
	{/if}
	<Heading tag="h6">Reading for Commemoration</Heading>
	<div>{@html c.body}</div>
	<Media mediaUrl={c.media} />
{/if}
