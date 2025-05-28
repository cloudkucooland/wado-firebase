<script lang="ts">
	import { showEdit } from '../../model/preferences';
	import Media from '../Media.svelte';
	import prayer from '../../model/prayer';
	import type { prayerFromFirestore } from '../../model/types';
	import type { Readable } from 'svelte/store';
	import { getContext } from 'svelte';
	// import { Icon } from "sveltestrap";
	import { push } from 'svelte-spa-router';

	export let data: prayerFromFirestore;
	export let bold: boolean;
	export let id: string;

	let cssClass = 'prayer';
	if (bold) {
		cssClass = 'prayer-bold';
	}

	const p = new prayer(data);
	p.id = id;
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
		<button on:click={$qe(p)}>
			<Icon name="pencil-square" />
		</button>
	</div>{/if}
<div class={cssClass}>{@html p.body}</div>
{#if p.author}<div class="prayer-credit">{p.author}</div>{/if}
<Media mediaUrl={p.media} />
