<script lang="ts">
	import { showEdit } from '../../model/preferences';
	import Media from '../Media.svelte';
	import hymn from '../../model/hymn';
	import type { prayerFromFirestore } from '../../model/types';
	import type { Readable } from 'svelte/store';
	import { getContext } from 'svelte';
	// import { Icon } from "sveltestrap";
	import { push } from 'svelte-spa-router';

	export let data: prayerFromFirestore;
	export let id: string;

	const h = new hymn(data);
	h.id = id;
	const qe: Readable<any> = getContext('qe');
</script>

{#if $showEdit}<div class="edit">
		<button
			on:click={() => {
				push('#/edit/' + id);
			}}
		>
			<Icon name="pencil" />
		</button>
		<button on:click={$qe(h)}>
			<Icon name="pencil-square" />
		</button>
	</div>{/if}
<h5>{h.name}</h5>
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
