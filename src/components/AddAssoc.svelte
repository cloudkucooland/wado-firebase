<script lang="ts">
	import { doc } from 'firebase/firestore';
	import { db } from '../firebase';
	import { onMount, afterUpdate } from 'svelte';
	import association from '../model/association';
	import type { associationFromFirestore } from '../model/types';
	import season from '../model/season';
	import { Input, Button } from 'flowbite-svelte';
	import Select from 'svelte-select';
	import { index } from '../meili';
	import { toasts } from 'svelte-toasts';

	export let result: association;
	export let location: string = '';
	let a: association = new association('', {
		Location: location,
		Season: result && result.Season ? result.Season : 'Any',
		Proper: result && result.Proper ? +result.Proper : -1,
		Weekday: result && result.Weekday ? +result.Weekday : -1,
		Year: result && result.Year ? result.Year : 'Any',
		Weight: result && result.Weight ? +result.Weight : 1,
		Reference: result && result.Reference ? result.Reference : doc(db, 'ex', 'nihilo')
	} as associationFromFirestore);
	console.log('location', location, 'incoming', result, 'built', a);

	let calDateSet = false;
	let selectedSeason = season.LUT.get(a.Season);
	let properName = 'Proper';

	onMount(async () => {
		console.log('onMount a', a);
		result = a;
	});

	afterUpdate(() => {
		console.log('afterUpdate');

		result = a;
		selectedSeason = season.LUT.get(a.Season);
		if (!selectedSeason) {
			console.log('selectedSeason', selectedSeason);
			return; // XXXX should not happen, debugging
		}

		if (result.CalendarDate !== 'Any') {
			calDateSet = true;
		} else {
			calDateSet = false;
		}
		properName = selectedSeason.properName ? selectedSeason.properName : 'Proper';
	});

	async function loadOptions(searchString: string): Promise<void> {
		console.log(searchString);
		const items = [];

		try {
			const searchresult = await index.search(searchString, {
				attributesToRetrieve: ['fsid', 'Name', 'Class'],
				filter: [['Class = Prayer', 'Class = Hymn', 'Class = Antiphon', 'Class = Commemoration']]
			});

			for (const r of searchresult.hits) {
				items.push({ value: r.fsid, label: r.Name, group: r.Class });
			}
		} catch (err: Error) {
			console.log(err);
			toasts.error(err.message);
		}
		return items;
	}

	function doSelect(e: any): void {
		console.log(e.detail);
		try {
			a.Reference = doc(db, 'prayers', e.detail.value);
		} catch (err: Error) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	const groupBy = (item: any) => item.group;
</script>

<div class="grid w-full grid-flow-row-dense grid-cols-12">
	<div class="colspan-2">Location</div>
	<div class="col-span-6">
		{location}
	</div>
	<div class="col-span-4">
		<Button href="#/addPrayer">Add Prayer</Button>
	</div>

	<div class="col-span-2">Prayer</div>
	<div class="col-span-10">
		<Select
			name="prayer"
			placeholder="search for prayer"
			oninput={loadOptions}
			onchange={doSelect}
			{groupBy}
		/>
	</div>

	<div class="col-span-3">Season</div>
	<div class="col-span-2">{properName} <span class="small">(-1 for "Any")</span></div>
	<div class="col-span-3">Weekday</div>
	<div class="col-span-2">Year</div>
	<div class="col-span-2">Weight</div>

	<div class="col-span-3">
		<Select bind:value={a.Season} disabled={calDateSet}>
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
		</Select>
	</div>
	<div class="col-span-2">
		<Input
			bind:value={a.Proper}
			type="number"
			max={selectedSeason.maxProper}
			min={-1}
			disabled={calDateSet || selectedSeason.maxProper == 0}
		/>
	</div>
	<div class="col-span-3">
		<Input
			type="select"
			bind:value={a.Weekday}
			disabled={calDateSet || !selectedSeason.useWeekdays}
		>
			<option value={-1}>Any</option>
			<option value={0}>Sunday</option>
			<option value={1}>Monday</option>
			<option value={2}>Tuesday</option>
			<option value={3}>Wednesday</option>
			<option value={4}>Thursday</option>
			<option value={5}>Friday</option>
			<option value={6}>Saturday</option>
		</Input>
	</div>
	<div class="col-span-2">
		<Input type="select" bind:value={a.Year} disabled={calDateSet}>
			<option value="Any">Any</option>
			<option value="A">A</option>
			<option value="B">B</option>
			<option value="C">C</option>
		</Input>
	</div>
	<div class="col-span-2">
		<Input bind:value={a.Weight} type="number" min={0} max={99} disabled={calDateSet} />
	</div>

	<div class="col-span-2">&nbsp;</div>
	<div class="col-span-8">(fixed-dates are very rare; "Any" to use season-relative dates)</div>
	<div class="col-span-2">&nbsp;</div>

	<div class="col-span-2">Fixed Date</div>
	<div class="col-span-10">
		<Input bind:value={a.CalendarDate} placeholder="mm-dd" />
	</div>
</div>
