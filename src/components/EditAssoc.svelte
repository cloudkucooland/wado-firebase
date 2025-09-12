<script lang="ts">
	import { getDoc, doc } from 'firebase/firestore';
	import { db } from '../firebase';
	import { onMount, afterUpdate } from 'svelte';
	import association from '../model/association';
	import type { associationFromFirestore } from '../model/types';
	import season from '../model/season';
	import { Input, Select } from 'flowbite-svelte';

	export let id: string;
	export let result: association;
	export let addToID: string = '';

	// change this to association.fromProper({});
	const dummy = {
		Location: 'UNSET',
		Season: 'Any',
		Proper: -1,
		Weekday: -1,
		Weight: 1,
		Year: 'Any',
		Reference: doc(db, 'ex', 'nihilo')
	} as associationFromFirestore;
	let a: association = new association('', dummy);

	let calDateSet: boolean = false;
	let selectedSeason: season = season.LUT.get(a.Season);
	let properName: string = 'Proper';

	onMount(async () => {
		if (addToID != '') {
			// use the dummy data if adding
			dummy.Reference = doc(db, 'prayers', addToID);
			a = new association('', dummy);
			result = a;
			return;
		}

		// get the current one, from firestore
		const d = await getDoc(doc(db, 'associations', id));
		a = new association(d.id, d.data() as associationFromFirestore);
		selectedSeason = season.LUT.get(a.Season);
		result = a;
		if (result.CalendarDate !== 'Any') {
			calDateSet = true;
		} else {
			calDateSet = false;
		}
		properName = selectedSeason.properName ? selectedSeason.properName : 'Proper';
	});

	afterUpdate(() => {
		result = a;
		selectedSeason = season.LUT.get(a.Season);
		if (result.CalendarDate !== 'Any') {
			calDateSet = true;
		} else {
			calDateSet = false;
		}
		properName = selectedSeason.properName ? selectedSeason.properName : 'Proper';
	});
</script>

<div class="w-full grid-flow-row-dense grid-cols-12">
	<div class="col-span-4">Location</div>
	<div class="col-span-8">
		<Select bind:value={a.Location}>
			{#each association.locations as l}
				<option value={l}>{l}</option>
			{/each}
		</Select>
	</div>

	<div class="col-span-4">Season</div>
	<div class="col-span-8">
		<Select bind:value={a.Season} disabled={calDateSet}>
			<option value="Any">Any</option>
			{#each Array.from(season.LUT.keys()) as s}
				<option value={s}>{s}</option>
			{/each}
		</Select>
	</div>

	<div class="col-span-4">{properName} <span class="small">(-1 for "Any")</span></div>
	<div class="col-span-8">
		<Input
			bind:value={a.Proper}
			type="number"
			max={selectedSeason.maxProper}
			min={-1}
			disabled={calDateSet || selectedSeason.maxProper == 0}
		/>
	</div>

	<div class="col-span-4">Weekday</div>
	<div class="col-span-8">
		<Select bind:value={a.Weekday} disabled={calDateSet || !selectedSeason.useWeekdays}>
			<option value={-1}>Any</option>
			<option value={0}>Sunday</option>
			<option value={1}>Monday</option>
			<option value={2}>Tuesday</option>
			<option value={3}>Wednesday</option>
			<option value={4}>Thursday</option>
			<option value={5}>Friday</option>
			<option value={6}>Saturday</option>
		</Select>
	</div>

	<div class="col-span-4">Year</div>
	<div class="col-span-8">
		<Select bind:value={a.Year} disabled={calDateSet}>
			<option value="Any">Any</option>
			<option value="A">A</option>
			<option value="B">B</option>
			<option value="C">C</option>
		</Select>
	</div>

	<div class="col-span-4">Weight</div>
	<div class="col-span-8">
		<Input bind:value={a.Weight} type="number" min={0} max={99} disabled={calDateSet} />
	</div>

	<div class="col-span-2">&nbsp;</div>
	<div class="col-span-8">(fixed-dates are very rare; "Any" to use season-relative dates)</div>
	<div class="col-span-2">&nbsp;</div>

	<div class="col-span-4">Fixed Date</div>
	<div class="col-span-8">
		<Input bind:value={a.CalendarDate} placeholder="mm-dd" />
	</div>
</div>
