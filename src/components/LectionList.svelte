<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		Input,
		Button,
		Tabs,
		TabItem,
		Label,
		Modal,
		Heading as FBHeading
	} from 'flowbite-svelte';
	import { collection, query, where, limit, doc, addDoc, setDoc } from 'firebase/firestore';
	import { db, recordEvent, screenView, getDocsCacheFirst } from '../firebase';
	import proper from '../model/proper';
	import { getContext } from 'svelte';
	import { toasts } from 'svelte-toasts';
	import { link } from 'svelte-spa-router';
	import lection from '../model/lection';
	import type { user } from '../model/user';
	import type { lectionFromFirestore } from '../model/types';

	// 1. Props & Context
	let { params = { y: 'A' } } = $props();
	const userContext = getContext<{ details: user }>('me');
	const me = $derived(userContext.details);

	// 2. Reactive State
	let year = $derived(params.y || 'A');
	let lections = $state(new Map<string, [proper, lection]>());
	let lectionModalOpen = $state(false);

	// Modal Data Helper Class (Internal)
	class mdClass {
		morning = $state('');
		evening = $state('');
		morningtitle = $state('');
		eveningtitle = $state('');
		morningpsalm = $state('');
		eveningpsalm = $state('');
		season = $state('');
		proper = $state(0);
		weekday = $state(0);
		key = $state('');
		path = $state('');
		_morningpsalmref = $state('');
		_eveningpsalmref = $state('');

		constructor(obj: lectionFromFirestore & { key?: string; path?: string }) {
			this.morning = obj.morning || '';
			this.evening = obj.evening || '';
			this.morningtitle = obj.morningtitle || '';
			this.eveningtitle = obj.eveningtitle || '';
			this.morningpsalm = obj.morningpsalm || '';
			this.eveningpsalm = obj.eveningpsalm || '';
			this.season = obj.season || '';
			this.proper = typeof obj.proper === 'number' ? obj.proper : 0;
			this.weekday = typeof obj.weekday === 'number' ? obj.weekday : 0;
			this.key = obj.key || '';
			this.path = obj.path || '';
			this._morningpsalmref = obj._morningpsalmref || '';
			this._eveningpsalmref = obj._eveningpsalmref || '';
		}
	}

	let modalData = $state(new mdClass({}));

	// 3. Data Loading
	async function loadLections(y: string) {
		const progressBar = toasts.success('Loading Data', 'initializing', { duration: 0 });

		const ay: Map<string, proper> = proper.AllYear(y);
		const out = new Map<string, [proper, lection]>();
		const emptyLection = new lection({});

		// Pre-populate with placeholders
		for (const [k, v] of ay) {
			out.set(k, [v, emptyLection]);
		}

		let i = 0;
		for (const [k, v] of ay) {
			try {
				const q = query(
					collection(db, 'lections', y, 'l'),
					where('season', '==', v.season),
					where('weekday', '==', v.weekday),
					where('proper', '==', v.proper),
					limit(1)
				);
				const res = await getDocsCacheFirst(q);

				if (!res.empty) {
					const n = res.docs[0].data() as lectionFromFirestore;
					const newLection = new lection(n);
					newLection.path = res.docs[0].ref.path;
					out.set(k, [v, newLection]);
				}

				if (i % 20 === 0) {
					progressBar.update({ description: `Processed ${i} days...` });
				}
				i++;
			} catch (err: any) {
				console.error(err);
			}
		}

		lections = out; // Final state update
		progressBar.remove();
	}

	// 4. Effects: Load data when year changes
	$effect(() => {
		loadLections(year);
		screenView(`Lection List: Year ${year}`);
	});

	async function toggleLectionModalOpen(key?: string) {
		lectionModalOpen = !lectionModalOpen;

		if (lectionModalOpen && key) {
			const entry = lections.get(key);
			if (entry) {
				const [p, l] = entry;
				modalData = new mdClass({
					morning: l.morning.trim(),
					evening: l.evening.trim(),
					morningpsalm: l.morningpsalm.trim(),
					eveningpsalm: l.eveningpsalm.trim(),
					morningtitle: l.morningtitle.trim(),
					eveningtitle: l.eveningtitle.trim(),
					season: p.season,
					proper: p.proper,
					weekday: p.weekday,
					path: l.path || '',
					key
				});
			}
		}
	}

	async function confirmLectionModal() {
		recordEvent('edit_lection', { key: modalData.key });
		lectionModalOpen = false;

		const data: lectionFromFirestore = {
			morning: modalData.morning.trim(),
			morningpsalm: modalData.morningpsalm.trim(),
			morningtitle: modalData.morningtitle.trim(),
			evening: modalData.evening.trim(),
			eveningpsalm: modalData.eveningpsalm.trim(),
			eveningtitle: modalData.eveningtitle.trim(),
			season: modalData.season,
			proper: modalData.proper,
			weekday: modalData.weekday
		};

		// Link psalms
		try {
			const fetchRef = async (name: string) => {
				const q = query(
					collection(db, 'prayers'),
					where('Class', '==', 'psalm'),
					where('Name', '==', name)
				);
				const res = await getDocsCacheFirst(q);
				return res.empty ? null : res.docs[0].id;
			};

			data._morningpsalmref = await fetchRef(modalData.morningpsalm.trim());
			data._eveningpsalmref = await fetchRef(modalData.eveningpsalm.trim());
		} catch (err: any) {
			toasts.error(err.message);
		}

		// Save to Firestore
		try {
			if (!modalData.path) {
				const added = await addDoc(collection(db, 'lections', year, 'l'), data);
				modalData.path = added.path;
			} else {
				await setDoc(doc(db, modalData.path), data);
			}

			// Reactive update of the Map
			const updatedProper = new proper(modalData);
			const updatedLection = new lection(modalData);
			updatedLection.path = modalData.path;

			lections.set(modalData.key, [updatedProper, updatedLection]);
			toasts.success('Lection saved');
		} catch (err: any) {
			toasts.error(err.message);
		}
	}
</script>

<svelte:head>
	<title>WADO Lectionary Editor: Year {year}</title>
</svelte:head>

<div class="w-full space-y-4 p-4">
	<FBHeading tag="h2">Lectionary Editor: Year {year}</FBHeading>

	<div class="flex border-b border-gray-200 dark:border-gray-700">
		{#each ['A', 'B', 'C'] as y}
			<a
				href="#/lectionary/{y}"
				class="px-6 py-3 {year === y
					? 'border-b-2 border-blue-600 text-blue-600'
					: 'text-gray-500'}"
			>
				Year {y}
			</a>
		{/each}
	</div>

	<Table hoverable={true}>
		<TableBody>
			{#each [...lections] as [k, v]}
				<TableBodyRow class="bg-gray-100 font-bold dark:bg-gray-800">
					<TableBodyCell colspan={3}>
						<div class="flex items-center justify-between">
							<span>{k}</span>
							{#if me.isEditor}
								<Button size="xs" color="blue" onclick={() => toggleLectionModalOpen(k)}
									>Edit {k}</Button
								>
							{/if}
						</div>
					</TableBodyCell>
				</TableBodyRow>

				<TableBodyRow>
					<TableBodyCell>
						<span class="block text-xs text-gray-400 uppercase">Morning Psalm</span>
						{#if v[1]._morningpsalmref}
							<a href="#/edit/{v[1]._morningpsalmref}" class="text-blue-500 italic hover:underline"
								>{v[1].morningpsalm}</a
							>
						{:else}
							{v[1].morningpsalm || '—'}
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						<span class="block text-xs text-gray-400 uppercase">Morning Lesson</span>
						{v[1].morning || '—'}
					</TableBodyCell>
					<TableBodyCell>
						<span class="block text-xs text-gray-400 uppercase">Title</span>
						{v[1].morningtitle || '—'}
					</TableBodyCell>
				</TableBodyRow>

				<TableBodyRow>
					<TableBodyCell>
						<span class="block text-xs text-gray-400 uppercase">Evening Psalm</span>
						{#if v[1]._eveningpsalmref}
							<a href="#/edit/{v[1]._eveningpsalmref}" class="text-blue-500 italic hover:underline"
								>{v[1].eveningpsalm}</a
							>
						{:else}
							{v[1].eveningpsalm || '—'}
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						<span class="block text-xs text-gray-400 uppercase">Evening Lesson</span>
						{v[1].evening || '—'}
					</TableBodyCell>
					<TableBodyCell>
						<span class="block text-xs text-gray-400 uppercase">Title</span>
						{v[1].eveningtitle || '—'}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<Modal title="Edit Lection: {modalData.key}" bind:open={lectionModalOpen} size="xl">
	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-2">
			<FBHeading tag="h4">Morning</FBHeading>
			<Label>Psalm</Label>
			<Input bind:value={modalData.morningpsalm} />
			<Label>Lesson</Label>
			<Input bind:value={modalData.morning} />
			<Label>Title</Label>
			<Input bind:value={modalData.morningtitle} />
		</div>
		<div class="space-y-2">
			<FBHeading tag="h4">Evening</FBHeading>
			<Label>Psalm</Label>
			<Input bind:value={modalData.eveningpsalm} />
			<Label>Lesson</Label>
			<Input bind:value={modalData.evening} />
			<Label>Title</Label>
			<Input bind:value={modalData.eveningtitle} />
		</div>
	</div>
	<svelte:fragment slot="footer">
		<Button color="green" onclick={confirmLectionModal}>Save Changes</Button>
		<Button color="alternative" onclick={() => (lectionModalOpen = false)}>Cancel</Button>
	</svelte:fragment>
</Modal>
