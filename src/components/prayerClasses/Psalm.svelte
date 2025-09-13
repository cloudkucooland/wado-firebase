<script lang="ts">
	import { showEdit } from '../../model/preferences';
	import Media from '../Media.svelte';
	import psalm from '../../model/psalm';
	import type { prayerFromFirestore } from '../../model/types';
	import type { Readable } from 'svelte/store';
	import { getContext } from 'svelte';
	import { Heading } from 'flowbite-svelte';
	import { EditSolid, CloudMeatballSolid } from 'flowbite-svelte-icons';
	import { push } from 'svelte-spa-router';
	import { toasts } from 'svelte-toasts';
	import Antiphon from './Antiphon.svelte';
	import Location from '../Location.svelte';
	import { getDoc } from 'firebase/firestore';

	export let data: prayerFromFirestore;
	export let id: string;
	export let gloria: boolean;
	export const bold: boolean = false;
	export const subunit: string | null = null;

	const p = new psalm(data);
	p.id = id;
	let antiphon: prayerFromFirestore;
	let antID: string;

	if (p.antiphon) {
		try {
			getDoc(p.antiphon).then((snap) => {
				antID = snap.id;
				antiphon = snap.data() as prayerFromFirestore;
			});
		} catch (err: any) {
			console.log(err);
			toasts.error(err.message);
		}
	}
</script>

<Heading tag="h5">
	{p.name}
	{#if $showEdit}<span class="edit">
			<button
				on:click={() => {
					push('#/edit/' + p.id);
				}}
			>
				<EditSolid />
			</button>
		</span>{/if}
</Heading>
{#if p.rubric}
	<div class="psalm-rubric">{p.rubric}</div>
{/if}
{#if antiphon}
	<div><Antiphon data={antiphon} id={antID} /></div>
	<br />
{/if}
<div class="psalm">{@html p.body}</div>
{#if p.author}
	<div class="psalm-credit">{p.author}</div>
{/if}
<Media mediaUrl={p.media} />
{#if gloria}
	<Location name="GENERAL-GLORIA" />
{/if}
{#if antiphon}
	<Antiphon data={antiphon} id={antID} />
{/if}
