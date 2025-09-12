<script lang="ts">
	import { showEdit } from '../../model/preferences';
	import Media from '../Media.svelte';
	import hymn from '../../model/hymn';
	import type { prayerFromFirestore } from '../../model/types';
	import type { Readable } from 'svelte/store';
	import { getContext } from 'svelte';
	import { EditSolid, CloudMeatballSolid } from 'flowbite-svelte-icons';
	import { push } from 'svelte-spa-router';
	import { Heading } from 'flowbite-svelte';

	export let data: prayerFromFirestore;
	export let id: string;

	const h = new hymn(data);
	h.id = id;
</script>

{#if $showEdit}<div class="edit">
		<button
			on:click={() => {
				push('#/edit/' + id);
			}}
		>
			<EditSolid />
		</button>
	</div>{/if}
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
	{#if h.author}
		<div class="hymnmeter">{h.author}</div>
	{/if}
</div>
<Media mediaUrl={h.media} />
