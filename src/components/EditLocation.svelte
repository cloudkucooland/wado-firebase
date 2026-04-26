<script lang="ts">
	import {
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		Button,
		Modal,
		Label,
		Input,
		Select
	} from 'flowbite-svelte';
	import {
		collection,
		query,
		where,
		doc,
		getDoc,
		getDocs,
		deleteDoc,
		setDoc,
		addDoc,
		type QuerySnapshot,
		type DocumentData
	} from 'firebase/firestore';
	import { db, recordEvent, screenView, getDocCacheFirst } from '../firebase';
	import { push } from 'svelte-spa-router';
	import association from '../model/association';
	import prayer from '../model/prayer';
	import { onMount } from 'svelte';
	import { toasts } from 'svelte-toasts';
	import EditAssoc from './EditAssoc.svelte';
	import AddAssoc from './AddAssoc.svelte';
	import type { prayerFromFirestore, associationFromFirestore } from '../model/types';

	let { params } = $props<{ params: { id?: string } }>();
	
	let id = $derived(params.id || 'Any');
	let associations = $state(new Map<string, association>());
	let modalId = $state('exnihilo');
	let assocEditResult = $state<association | null>(null);
	let assocAddResult = $state<association | null>(null);

	let deleteModalOpen = $state(false);
	let editModalOpen = $state(false);
	let addModalAssocOpen = $state(false);

	const locationlist = Array.from(association.locations, (i) => {
		return { name: i, value: i };
	});
	locationlist.push({ name: 'Any', value: 'Any' });

	function toggleDeleteOpen(e: Event): void {
		screenView('edit: toggleDeleteOpen');
		deleteModalOpen = !deleteModalOpen;
		const t = e.target as HTMLInputElement;
		if (deleteModalOpen) modalId = t.value;
	}

	async function confirmDelete(e: Event): Promise<void> {
		const t = e.target as HTMLInputElement;
		const targetModalId = t.value || modalId;
		recordEvent('delete_assoc', { id: id, assoc: targetModalId });
		console.debug('deleting association', targetModalId);
		deleteModalOpen = false;

		try {
			await deleteDoc(doc(db, 'associations', targetModalId));
			associations.delete(targetModalId);
			toasts.success('Association deleted', targetModalId);
		} catch (err: any) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	function toggleEditOpen(e: Event): void {
		screenView('toggleEditOpen');
		editModalOpen = !editModalOpen;
		if (editModalOpen) {
			const t = e.target as HTMLInputElement;
			modalId = t.value;
		}
	}

	async function confirmEdit(e: Event): Promise<void> {
		const t = e.target as HTMLInputElement;
		const targetModalId = t.value || modalId;
		if (!assocEditResult) return;

		recordEvent('edit_assoc', { id: id, assoc: targetModalId });
		editModalOpen = false;

		console.log('edit result', assocEditResult);
		try {
			await setDoc(doc(db, 'associations', targetModalId), assocEditResult.toFirebase());

			const rp = await getDocCacheFirst(assocEditResult.Reference);
			const tp = rp.data() as prayerFromFirestore;
			const pp = new prayer(tp);
			
			assocEditResult._PrayerName = pp.name;
			
			associations.set(targetModalId, assocEditResult);
			// Sort the map (Svelte 5 Map reactivity works)
			const sorted = new Map([...associations].sort(association.sort));
			associations = sorted;
			
			toasts.success('Saved Association', targetModalId);
		} catch (error: any) {
			console.log(error);
			toasts.error(error.message);
		}
	}

	function toggleAddAssocOpen(e: Event): void {
		screenView('toggleAddAssocOpen');
		addModalAssocOpen = !addModalAssocOpen;
		if (addModalAssocOpen) {
			const t = e.target as HTMLInputElement;
			modalId = t.value;
		}
	}

	async function confirmAddAssoc(): Promise<void> {
		if (!assocAddResult) return;
		addModalAssocOpen = false;

		try {
			console.debug(assocAddResult);
			await addDoc(collection(db, 'associations'), assocAddResult.toFirebase());
			await loadLocation(id);
		} catch (err: any) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	async function loadLocation(targetId: string): Promise<void> {
		console.log('loadLocation', targetId);
		const progressBar = toasts.success('Loading Data', targetId, { duration: 0 });
		
		const newAssn = new Map<string, association>();
		try {
			const q = query(collection(db, 'associations'), where('Location', '==', targetId));
			const res = await getDocs(q);

			for (const a of res.docs) {
				const n = new association(a.id, a.data() as associationFromFirestore);

				if (!n.Reference || n.Reference.path === 'ex/nihilo') {
					console.error('bad reference, deleting association', a, n);
					toasts.info('Deleting Invalid Association', n.id);
					deleteDoc(doc(db, 'associations', n.id));
					continue;
				}

				const rp = await getDoc(n.Reference);
				if (!rp || !rp.exists()) {
					console.error('bad reference, deleting association', a, n, rp);
					toasts.info('Deleting Invalid Association', n.id);
					deleteDoc(doc(db, 'associations', n.id));
					continue;
				}

				try {
					const tp = rp.data() as prayerFromFirestore;
					const pp = new prayer(tp);
					n._PrayerName = pp.name;
					newAssn.set(a.id, n);
				} catch (err: any) {
					console.error(err);
				}
			}

			// Sort and update state
			associations = new Map([...newAssn].sort(association.sort));
		} catch (error: any) {
			console.log(error);
			toasts.error(error.message);
		} finally {
			progressBar.remove();
		}
	}

	onMount(() => {
		screenView('EditLocation');
	});

	$effect(() => {
		if (id) {
			loadLocation(id);
		}
	});
</script>

<svelte:head>
	<title>Edit Location: {id}</title>
</svelte:head>

<div class="w-full grid-flow-row-dense grid-cols-1">
	<div>
		<Label for="locations">Location</Label>
		<Select
			name="locations"
			items={locationlist}
			value={id}
			onchange={(e) => {
				const val = (e.target as HTMLSelectElement).value;
				push('/editlocation/' + val);
			}}
		/>
	</div>
	<div>
		<h3>Associations for {id}</h3>
		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell>Prayer</TableHeadCell>
				<TableHeadCell>Calendar Date</TableHeadCell>
				<TableHeadCell>Season</TableHeadCell>
				<TableHeadCell>Proper</TableHeadCell>
				<TableHeadCell>Weekday</TableHeadCell>
				<TableHeadCell>Lectionary Year</TableHeadCell>
				<TableHeadCell>Weight</TableHeadCell>
				<TableHeadCell>&nbsp;</TableHeadCell>
				<TableHeadCell>&nbsp;</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each [...associations] as [k, v]}
					<TableBodyRow id={k}>
						<TableBodyCell class="w-max-40 text-wrap">
							<a href="#/edit/{v.Reference.id}" class="text-wrap">
								{v._PrayerName}
							</a>
						</TableBodyCell>
						<TableBodyCell>{v.CalendarDate}</TableBodyCell>
						<TableBodyCell>{v.Season}</TableBodyCell>
						<TableBodyCell>{v.ProperDisplay}</TableBodyCell>
						<TableBodyCell>{v.WeekdayDisplay}</TableBodyCell>
						<TableBodyCell>{v.Year}</TableBodyCell>
						<TableBodyCell>{v.Weight}</TableBodyCell>
						<TableBodyCell>
							<Button onclick={toggleEditOpen} value={k} color="red">Edit</Button>
						</TableBodyCell>
						<TableBodyCell>
							<Button onclick={toggleDeleteOpen} value={k} color="red">Delete</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		<div>
			<Button color="red" onclick={toggleAddAssocOpen}>Add</Button>
		</div>
	</div>
</div>
<Modal id="deleteModal" bind:open={deleteModalOpen} size="xs" autoclose>
	<div class="text-center">
		<p class="mb-5 text-lg font-normal text-gray-500">
			Are you sure you want to delete this association?
		</p>
		<Button color="red" onclick={confirmDelete} value={modalId}>Confirm Delete</Button>
		<Button color="alternative">Cancel</Button>
	</div>
</Modal>

<Modal id="editModal" bind:open={editModalOpen} size="xl">
	<svelte:fragment slot="header">Edit Association</svelte:fragment>
	<div>
		{#if editModalOpen}
			<EditAssoc id={modalId} bind:result={assocEditResult} />
		{/if}
	</div>
	<svelte:fragment slot="footer">
		<Button color="green" onclick={confirmEdit} value={modalId}>Save Changes</Button>
		<Button color="alternative" onclick={() => (editModalOpen = false)}>Cancel</Button>
	</svelte:fragment>
</Modal>

<Modal id="addAssoc" bind:open={addModalAssocOpen} size="xl">
	<svelte:fragment slot="header">Add Association</svelte:fragment>
	<div>
		{#if addModalAssocOpen}
			<AddAssoc bind:result={assocAddResult} location={id} />
		{/if}
	</div>
	<svelte:fragment slot="footer">
		<Button color="green" onclick={confirmAddAssoc}>Add Association</Button>
		<Button color="alternative" onclick={() => (addModalAssocOpen = false)}>Cancel</Button>
	</svelte:fragment>
</Modal>
