<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';

	import Hymn from './prayerClasses/Hymn.svelte';
	import Prayer from './prayerClasses/Prayer.svelte';
	import Psalm from './prayerClasses/Psalm.svelte';
	import Antiphon from './prayerClasses/Antiphon.svelte';
	import Commemoration from './prayerClasses/Commemoration.svelte';
	import type { prayerFromFirestore } from '../model/types';

	const lookup: Record<string, any> = {
		other: Prayer,
		hymn: Hymn,
		prayer: Prayer,
		psalm: Psalm,
		antiphon: Antiphon,
		commemoration: Commemoration
	};

	let {
		data,
		subunit = null,
		bold = false,
		gloria = false
	} = $props<{
		data: Map<string, prayerFromFirestore>;
		subunit?: string | null;
		bold?: boolean;
		gloria?: boolean;
	}>();

	function shortname(name: string) {
		if (name.length < 30) return name;
		const words = name.split(' ');
		let shortName = '';
		let i = 0;
		while (shortName.length < 25 && i < words.length) {
			if (i > 0) shortName += ' ';
			shortName += words[i];
			i++;
		}
		return shortName;
	}

	function lookupGet(c: string) {
		const className = c?.toLowerCase() || 'prayer';
		return lookup[className] || Prayer;
	}
</script>

<Tabs>
	{#each [...data] as [id, d], index}
		<TabItem title={shortname(d.Name)} open={index === 0}>
			{@const PrayerComp = lookupGet(d.Class)}
			{#if PrayerComp}
				<PrayerComp data={d} {id} {bold} {subunit} {gloria} />
			{/if}
		</TabItem>
	{/each}
</Tabs>
