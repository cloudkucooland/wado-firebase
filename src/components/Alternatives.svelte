<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';

	import Hymn from './prayerClasses/Hymn.svelte';
	import Prayer from './prayerClasses/Prayer.svelte';
	import Psalm from './prayerClasses/Psalm.svelte';
	import Antiphon from './prayerClasses/Antiphon.svelte';
	import Commemoration from './prayerClasses/Commemoration.svelte';
	import type { prayerFromFirestore } from '../model/types';
	import type { SvelteComponent } from 'svelte';

	export const lookup: Map<string, SvelteComponent> = new Map([
		['other', Prayer],
		['hymn', Hymn],
		['prayer', Prayer],
		['psalm', Psalm],
		['antiphon', Antiphon],
		['commemoration', Commemoration]
	]);

	export let data: Map<string, prayerFromFirestore>;
	export let subunit: string | null;
	export let bold: boolean;
	export let gloria: boolean;

	// the first tab is active
	let isA: number = 0;
	function isActive() {
		isA++;
		return isA == 1;
	}

	function shortname(name: string) {
		if (name.length < 30) return name;

		const words = name.split(' ');
		let shortName = '';
		let i = 0;
		while (shortName.length < 25) {
			if (i > 0) shortName += ' ';
			shortName += words[i];
			i = i + 1;
		}
		return shortName;
	}

	function lookupGet(c: string): SvelteComponent {
		if (!lookup.has(c)) {
			console.log('invalid class', c);
			c = 'prayer';
		}
		return lookup.get(c);
	}
</script>

<Tabs>
	{#each [...data] as [id, d]}
		<TabItem title={shortname(d.Name)} open={isActive()}>
			<svelte:component this={lookupGet(d.Class)} data={d} {id} {bold} {subunit} {gloria} />
		</TabItem>
	{/each}
</Tabs>
