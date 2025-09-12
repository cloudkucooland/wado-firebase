<script lang="ts">
	import { showEdit } from '../../model/preferences';
	import Media from '../Media.svelte';
	import commemoration from '../../model/commemoration';
	import type { prayerFromFirestore } from '../../model/types';
	import type { Readable } from 'svelte/store';
	import { getContext } from 'svelte';
	import { Heading } from 'flowbite-svelte';
	import { EditSolid, CloudMeatballSolid } from 'flowbite-svelte-icons';
	import { push } from 'svelte-spa-router';

	export let data: prayerFromFirestore;
	export let id: string;
	export let subunit: string;

	const c = new commemoration(data);
	c.id = id;
</script>

{#if subunit == 'morningcollect' && c.morningcollect}
	{@html c.morningcollect}
	{#if c.author}<div class="prayer-credit">{c.author}</div>{/if}
{/if}
{#if subunit == 'eveningcollect' && c.eveningcollect}
	{@html c.eveningcollect}
	{#if c.author}<div class="prayer-credit">{c.author}</div>{/if}
{/if}
{#if !subunit}
	{#if $showEdit}<div class="edit">
			<button
				on:click={() => {
					push('#/edit/' + id);
				}}
			>
				<EditSolid />
			</button>
		</div>{/if}
	<Heading tag="h6">Reading for Commemoration</Heading>
	<div>{@html c.body}</div>
	<Media mediaUrl={c.media} />
{/if}
