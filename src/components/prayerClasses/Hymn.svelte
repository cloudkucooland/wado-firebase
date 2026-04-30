<script lang="ts">
	import { prefs } from '../../model/preferences.svelte';
	import Heading from '../Heading.svelte';
	import Media from '../Media.svelte';
	import hymn from '../../model/hymn'; // Assuming this class exists
	import type { prayerFromFirestore } from '../../model/types';
	import { EditSolid } from 'flowbite-svelte-icons';
	import { push } from 'svelte-spa-router';

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

	const h = $derived.by(() => {
		const instance = new hymn(data);
		instance.id = id;
		return instance;
	});
</script>

{#if prefs.showEdit}
	<div class="edit">
		<div
			class="mb-2 flex items-center gap-2 rounded bg-gray-100 p-1 text-xs text-gray-400 dark:bg-gray-800"
		>
			<button
				onclick={() => push('#/edit/' + id)}
				class="hover:text-blue-500"
				title="Edit Hymn"
				aria-label="Edit Hymn"
			>
				<EditSolid size="xs" />
			</button>
		</div>
	</div>
{/if}

<Heading tag="h5">{h.name}</Heading>
<div class="hymn">{@html h.body}</div>
<div class="hymndata">
	{#if h.hymntune}
		<a href="https://hymnary.org/search?qu={h.hymntune}"
			><span class="hymntune">{h.hymntune}</span></a
		>
	{/if}
	{#if h.hymnmeter}
		<span class="hymnmeter">{h.hymnmeter}</span>
	{/if}
	{#if h.author}<div class="hymn-credit">{h.author}</div>{/if}
</div>
<Media mediaUrl={h.media} />
