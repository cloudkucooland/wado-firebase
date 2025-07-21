<script lang="ts">
	import { showEdit } from '../../model/preferences';
	import Media from '../Media.svelte';
	import antiphon from '../../model/antiphon';
	import type { prayerFromFirestore } from '../../model/types';
	import { Heading } from 'flowbite-svelte';
	import { EditSolid, CloudMeatballSolid } from 'flowbite-svelte-icons';
	import { push } from 'svelte-spa-router';
	import type { Readable } from 'svelte/store';
	import { getContext } from 'svelte';

	export let data: prayerFromFirestore;
	export let id: string;
	const qe: Readable<any> = getContext('qe');

	const ant = new antiphon(data);
	ant.id = id;
</script>

{#if $showEdit}<div class="edit">
		<button
			on:click={() => {
				push('#/edit/' + id);
			}}
		>
			<EditSolid />
		</button>
		<button on:click={$qe(ant)}>
			<CloudMeatballSolid />
		</button>
	</div>{/if}
<Heading tag="h6">Antiphon</Heading>
<div class="antiphon">{@html ant.body}</div>
{#if ant.author}
	<div class="antiphon-credit">{ant.author}</div>
{/if}
<Media mediaUrl={ant.media} />
