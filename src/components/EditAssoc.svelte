<script lang="ts">
	import { getDoc, doc } from 'firebase/firestore';
	import { db } from '../firebase';
	import { onMount } from 'svelte';
	import association from '../model/association';
	import type { associationFromFirestore } from '../model/types';
	import season from '../model/season';
	import { Input, Select as FBSelect } from 'flowbite-svelte';

	let {
		id,
		result = $bindable(),
		addToID = ''
	} = $props<{
		id: string;
		result: association;
		addToID?: string;
	}>();

	// Initialize state with a dummy/empty association
	let a = $state(
		new association('', {
			Location: 'UNSET',
			Season: 'Any',
			Proper: -1,
			Weekday: -1,
			Weight: 1,
			Year: 'Any',
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

	// Reset logic for season change
	$effect(() => {
		if (a.Season === 'Any') {
			a.Proper = -1;
			a.Weekday = -1;
		}
	});

	onMount(async () => {
		if (addToID != '') {
			// use the dummy data if adding
			const dummy: associationFromFirestore = {
				Location: 'UNSET',
				Season: 'Any',
				Proper: -1,
				Weekday: -1,
				Weight: 1,
				Year: 'Any',
				Reference: doc(db, 'prayers', addToID)
			};
			a = new association('', dummy);
			return;
		}

		// get the current one from firestore
		try {
			const d = await getDoc(doc(db, 'associations', id));
			if (d.exists()) {
				a = new association(d.id, d.data() as associationFromFirestore);
			}
		} catch (err) {
			console.error('Error loading association:', err);
		}
	});

	const locationItems = association.locations.map((l) => ({ name: l, value: l }));
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
	<div class="col-span-12">
		<label class="mb-2 block text-sm font-medium" for="location">Location</label>
		<FBSelect id="location" items={locationItems} bind:value={a.Location} />
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
