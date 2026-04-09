<script lang="ts">
	import { prefs } from '../../model/preferences.svelte';
	import Media from '../Media.svelte';
	import antiphon from '../../model/antiphon';
	import type { prayerFromFirestore } from '../../model/types';
	import { Heading } from 'flowbite-svelte';
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

	// 2. Reactive derivation of the class instance
	const ant = $derived.by(() => {
		const instance = new antiphon(data);
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
				title="Edit Antiphon"
			>
				<EditSolid size="xs" />
			</button>
		</div>
	</div>
{/if}

<Heading tag="h6">Antiphon</Heading>
<div class="antiphon">{@html ant.body}</div>

{#if ant.author}
	<div class="antiphon-credit">{ant.author}</div>
{/if}

<Media mediaUrl={ant.media} />
