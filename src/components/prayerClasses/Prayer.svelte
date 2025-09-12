<script lang="ts">
	import { showEdit } from '../../model/preferences';
	import Media from '../Media.svelte';
	import prayer from '../../model/prayer';
	import type { prayerFromFirestore } from '../../model/types';
	import type { Readable } from 'svelte/store';
	import { getContext } from 'svelte';
	import { EditSolid, CloudMeatballSolid } from 'flowbite-svelte-icons';
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
</script>

{#if $showEdit}<div class="edit">
		<button
			onclick={() => {
				push('#/edit/' + id);
			}}
		>
			<EditSolid />
		</button>
	</div>{/if}
<div class={cssClass}>{@html p.body}</div>
{#if p.author}<div class="prayer-credit">{p.author}</div>{/if}
<Media mediaUrl={p.media} />
