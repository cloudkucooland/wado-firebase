<script lang="ts">
	import { doc } from 'firebase/firestore';
	import { db } from '../firebase';
	import { onMount } from 'svelte';
	import association from '../model/association';
	import type { associationFromFirestore } from '../model/types';
	import season from '../model/season';
	import { Input, Button, Select as FBSelect } from 'flowbite-svelte';
	import Select from 'svelte-select';
	import { index } from '../meili';
	import { toasts } from 'svelte-toasts';

	let { result = $bindable(), location = 'UNSET' } = $props<{
		result: association;
		location?: string;
	}>();

	// Initialize state
	let a = $state(
		new association('', {
			Location: location,
			Season: 'Any',
			Proper: -1,
			Weekday: -1,
			Year: 'Any',
			Weight: 1,
			Reference: doc(db, 'ex', 'nihilo')
		} as associationFromFirestore)
	);

	// Derived values
	let selectedSeason = $derived(season.LUT.get(a.Season) || season.LUT.get('Any')!);
	let calDateSet = $derived(a.CalendarDate !== 'Any');
	let properName = $derived(selectedSeason.properName || 'Proper');

	// Keep result in sync with state
	$effect(() => {
		result = a;
	});

	$effect(() => {
		a.Location = location;
	});

	// Reset logic for season change
	$effect(() => {
		if (a.Season === 'Any') {
			a.Proper = -1;
			a.Weekday = -1;
		}
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

	const seasonItems = [
		{ name: 'Any', value: 'Any' },
		...Array.from(season.LUT.keys())
			.filter((s) => s !== 'Any')
			.map((s) => ({ name: s, value: s }))
	];

	const weekdayItems = [
		{ name: 'Any', value: -1 },
		{ name: 'Sunday', value: 0 },
		{ name: 'Monday', value: 1 },
		{ name: 'Tuesday', value: 2 },
		{ name: 'Wednesday', value: 3 },
		{ name: 'Thursday', value: 4 },
		{ name: 'Friday', value: 5 },
		{ name: 'Saturday', value: 6 }
	];

	const yearItems = [
		{ name: 'Any', value: 'Any' },
		{ name: 'A', value: 'A' },
		{ name: 'B', value: 'B' },
		{ name: 'C', value: 'C' }
	];
</script>

<div class="grid w-full grid-flow-row-dense grid-cols-12 gap-4">
	<div class="col-span-4 flex items-center">Location</div>
	<div class="col-span-4 flex items-center font-bold">
		{location}
	</div>
	<div class="col-span-4">
		<Button color="gray" size="xs" href="#/addPrayer">Add Prayer</Button>
	</div>

	<div class="col-span-12">
		<label class="mb-2 block text-sm font-medium" for="prayer-select">Prayer</label>
		<Select
			id="prayer-select"
			name="prayer"
			placeholder="search for prayer"
			{loadOptions}
			on:change={doSelect}
			{groupBy}
		/>
	</div>

	<div class="col-span-6">
		<label class="mb-2 block text-sm font-medium" for="season">Season</label>
		<FBSelect id="season" items={seasonItems} bind:value={a.Season} disabled={calDateSet} />
	</div>

	<div class="col-span-6">
		<label class="mb-2 block text-sm font-medium" for="proper">{properName}</label>
		<Input
			id="proper"
			bind:value={a.Proper}
			type="number"
			max={selectedSeason.maxProper}
			min={-1}
			disabled={calDateSet || selectedSeason.maxProper == 0}
		/>
	</div>

	<div class="col-span-4">
		<label class="mb-2 block text-sm font-medium" for="weekday">Weekday</label>
		<FBSelect
			id="weekday"
			items={weekdayItems}
			bind:value={a.Weekday}
			disabled={calDateSet || !selectedSeason.useWeekdays}
		/>
	</div>

	<div class="col-span-4">
		<label class="mb-2 block text-sm font-medium" for="year">Year</label>
		<FBSelect id="year" items={yearItems} bind:value={a.Year} disabled={calDateSet} />
	</div>

	<div class="col-span-4">
		<label class="mb-2 block text-sm font-medium" for="weight">Weight</label>
		<Input id="weight" bind:value={a.Weight} type="number" min={0} max={99} disabled={calDateSet} />
	</div>

	<div class="col-span-12">
		<hr class="my-2" />
		<p class="text-xs text-gray-500 italic">
			Fixed dates are rare. Use "Any" above to rely on season-relative logic.
		</p>
	</div>

	<div class="col-span-12">
		<label class="mb-2 block text-sm font-medium" for="fixed-date">Fixed Date (mm-dd)</label>
		<Input id="fixed-date" bind:value={a.CalendarDate} placeholder="mm-dd" />
	</div>
</div>
