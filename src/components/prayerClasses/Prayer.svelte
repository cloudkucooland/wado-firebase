<script lang="ts">
	import { prefs } from '../../model/preferences.svelte';
	import Media from '../Media.svelte';
	import prayer from '../../model/prayer';
	import type { prayerFromFirestore } from '../../model/types';
	import { EditSolid } from 'flowbite-svelte-icons';
	import { push } from 'svelte-spa-router';

	// 1. Svelte 5 Props
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

	// 2. Reactive CSS class derivation
	let cssClass = $derived(bold ? 'prayer-bold' : 'prayer');

	// 3. Reactive class instance
	const p = $derived.by(() => {
		const instance = new prayer(data);
		instance.id = id;
		return instance;
	});
</script>

{#if prefs.showEdit}
	<div class="edit">
		<div
			class="mb-2 flex items-center gap-2 rounded bg-gray-100 p-1 text-xs text-gray-400 dark:bg-gray-800"
		>
			<button onclick={() => push('#/edit/' + id)} class="hover:text-blue-500" title="Edit Prayer" aria-label="Edit Prayer">
				<EditSolid size="xs" />
			</button>
		</div>
	</div>
{/if}

<div class={cssClass}>{@html p.body}</div>

{#if p.author}
	<div class="prayer-credit">{p.author}</div>
{/if}

<Media mediaUrl={p.media} />
