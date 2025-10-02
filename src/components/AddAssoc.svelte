<script lang="ts">
	import { doc } from 'firebase/firestore';
	import { db } from '../firebase';
	import { onMount, afterUpdate } from 'svelte';
	import association from '../model/association';
	import type { associationFromFirestore } from '../model/types';
	import season from '../model/season';
	import { Input, Button, Select as BasicSelect } from 'flowbite-svelte';
	import Select from 'svelte-select';
	import { index } from '../meili';
	import { toasts } from 'svelte-toasts';

	export let result: association; // what is returned to the caller (EditLocation.svelte)
	export let location: string; // = 'UNSET';
	$: a = new association('', {
		Location: location,
		Season: 'Any',
		Proper: -1,
		Weekday: -1,
		Year: 'Any',
		Weight: 1,
		Reference: doc(db, 'ex', 'nihilo')
	} as associationFromFirestore);

	$: calDateSet = false;
	$: selectedSeason = season.LUT.get('Any');
	$: properName = 'Proper';

	onMount(async () => {
		result = a;
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

	async function loadOptions(searchString: string): Promise<Array<any>> {
		const items = [];

		try {
			const searchresult = await index.search(searchString, {
				attributesToRetrieve: ['fsid', 'Name', 'Class'],
				filter: [['Class = Prayer', 'Class = Hymn', 'Class = Antiphon', 'Class = Commemoration']]
			});

			for (const r of searchresult.hits) {
				items.push({ value: r.fsid, label: r.Name, group: r.Class });
			}
		} catch (err: any) {
			console.log(err);
			toasts.error(err.message);
		}
		return items;
	}

	function doSelect(e: any): void {
		try {
			a.Reference = doc(db, 'prayers', e.detail.value);
		} catch (err: any) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	const groupBy = (item: any) => item.group;
</script>

<div class="grid w-full grid-flow-row-dense grid-cols-12">
	<div class="col-span-2">Location</div>
	<div class="col-span-6">
		{location}
	</div>
	<div class="col-span-4">
		<Button color="gray" href="#/addPrayer">Add Prayer</Button>
	</div>

	<div class="col-span-2">Prayer</div>
	<div class="col-span-10">
		<Select
			name="prayer"
			placeholder="search for prayer"
			{loadOptions}
			on:change={doSelect}
			{groupBy}
		/>
	</div>

	<div class="col-span-4">Season</div>
	<div class="col-span-8">
		<BasicSelect bind:value={a.Season} disabled={calDateSet}>
			<option
				value="Any"
				onchange={() => {
					a.Proper = -1;
					a.Weekday = -1;
				}}>Any</option
			>
			{#each Array.from(season.LUT.keys()) as s}
				<option value={s}>{s}</option>
			{/each}
		</BasicSelect>
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
		<BasicSelect bind:value={a.Weekday} disabled={calDateSet || !selectedSeason.useWeekdays}>
			<option value={-1}>Any</option>
			<option value={0}>Sunday</option>
			<option value={1}>Monday</option>
			<option value={2}>Tuesday</option>
			<option value={3}>Wednesday</option>
			<option value={4}>Thursday</option>
			<option value={5}>Friday</option>
			<option value={6}>Saturday</option>
		</BasicSelect>
	</div>

	<div class="col-span-4">Year</div>
	<div class="col-span-8">
		<BasicSelect bind:value={a.Year} disabled={calDateSet}>
			<option value="Any">Any</option>
			<option value="A">A</option>
			<option value="B">B</option>
			<option value="C">C</option>
		</BasicSelect>
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
