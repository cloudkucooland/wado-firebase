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
		addDoc
	} from 'firebase/firestore';
	import { db, recordEvent, screenView, getDocCacheFirst } from '../firebase';
	import { push } from 'svelte-spa-router';
	import association from '../model/association';
	import prayer from '../model/prayer';
	import { onMount } from 'svelte';
	import { toasts } from 'svelte-toasts';
	import EditAssoc from './EditAssoc.svelte';
	import AddAssoc from './AddAssoc.svelte';
	import type { prayerFromFirestore } from '../model/types';

	// @ts-ignore
	export let params = { id };
	$: id = params.id ? params.id : 'Any';
	const _a: Map<string, association> = new Map();
	$: associations = _a;
	let modalId: string = 'exnihilo';
	let assocEditResult: association;
	let assocAddResult: association;

	const locationlist = Array.from(association.locations, (i) => {
		return { name: i, value: i };
	});
	locationlist.push({ name: 'Any', value: 'Any' });

	$: deleteModalOpen = false;
	function toggleDeleteOpen(e: Event): void {
		screenView('edit: toggleDeleteOpen');
		deleteModalOpen = !deleteModalOpen;
		const t = e.target as HTMLInputElement;
		if (deleteModalOpen) modalId = t.value;
	}

	async function confirmDelete(e: Event): Promise<void> {
		const t = e.target as HTMLInputElement;
		recordEvent('delete_assoc', { id: id, assoc: t.value });
		console.debug('deleting association', t.value);
		deleteModalOpen = !deleteModalOpen;

		try {
			await deleteDoc(doc(db, 'associations', t.value));
		} catch (err: any) {
			console.log(err);
			toasts.error(err.message);
		}

		// refresh screen
		const newAssn: Map<string, association> = new Map();
		for (const [k, a] of associations) {
			if (k != t.value) newAssn.set(k, a);
		}
		associations = newAssn;
		toasts.success('Association deleted', t.value);
	}

	$: editModalOpen = false;
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
		recordEvent('edit_assoc', { id: id, assoc: t.value });
		editModalOpen = !editModalOpen;

		console.log('edit result', assocEditResult);
		try {
			await setDoc(doc(db, 'associations', t.value), assocEditResult.toFirebase());

			const newAssn: Map<string, association> = new Map();
			for (const [k, v] of associations) {
				if (k != t.value) newAssn.set(k, v);
			}

			const rp = await getDocCacheFirst(assocEditResult.Reference);
			const tp = rp.data() as prayerFromFirestore;
			const pp = new prayer(tp);
			// @ts-ignore
			assocEditResult._PrayerName = pp.name;
			newAssn.set(t.value, assocEditResult);

			associations = new Map([...newAssn].sort(association.sort));
			toasts.success('Saved Association', t.value);
		} catch (error: any) {
			console.log(error);
			toasts.error(error.message);
		}
	}

	$: addModalAssocOpen = false;
	function toggleAddAssocOpen(e: Event): void {
		screenView('toggleAddAssocOpen');
		addModalAssocOpen = !addModalAssocOpen;
		if (addModalAssocOpen) {
			const t = e.target as HTMLInputElement;
			modalId = t.value;
		}
	}

	async function confirmAddAssoc(): Promise<void> {
		addModalAssocOpen = !addModalAssocOpen;

		try {
			console.debug(assocAddResult);
			await addDoc(collection(db, 'associations'), assocAddResult.toFirebase());
			loadLocation(id); // lazy but does the job -- redo if assocs get HUGE
		} catch (err: any) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	async function loadLocation(id: string): Promise<void> {
		console.log('loadLocation', id);
		const progressBar = toasts.success('Loading Data', id, { duration: 0 });
		let res: any; // FIXME

		const newAssn: Map<string, association> = new Map();
		try {
			const q = query(collection(db, 'associations'), where('Location', '==', id));
			res = await getDocs(q);
		} catch (error: any) {
			console.log(error);
			toasts.error(error.message);
		}

		for (const a of res.docs) {
			const n: association = new association(a.id, a.data());

			if (!n.Reference || n.Reference == 'FIXME' || n.Reference.path == 'ex/nihilo') {
				// "FIXME" is an err in conversion, "ex/nihilo" is an error in the new add logic
				console.error('bad reference, deleting association', a, n);
				toasts.info('Deleting Invalid Association', n.id);
				try {
					deleteDoc(doc(db, 'associations', n.id)); // no need to await here
				} catch (err: any) {
					console.log(err);
				}
				continue;
			}

			const rp = await getDoc(n.Reference);
			if (!rp || !rp.exists()) {
				console.error('bad reference, deleting association', a, n, rp);
				toasts.info('Deleting Invalid Association', n.id);
				try {
					deleteDoc(doc(db, 'associations', n.id)); // no need to await here
				} catch (err: any) {
					console.log(err);
				}
				continue;
			}

			try {
				const tp = rp.data() as prayerFromFirestore;
				const pp: prayer = new prayer(tp);
				// @ts-ignore
				n._PrayerName = pp.name;
				newAssn.set(a.id, n);
			} catch (err: any) {
				console.log(err);
				toasts.error(err.message);
			}
		}

		// now that the full list is built, sort it
		associations = new Map([...newAssn].sort(association.sort));
		progressBar.remove();
	}

	onMount(async () => {
		screenView('EditLocation');
		await loadLocation(id);
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
			onchange={(e) => {
				// @ts-ignore
				id = e.target.value;
				push('/editlocation/' + id);
				loadLocation(id);
			}}
		/>
	</div>
	<div>
		<h3>Associations for {id}</h3>
		<Table>
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
<Modal id="deleteModal" bind:open={deleteModalOpen}>
	<h3>Delete Association</h3>
	<div>Confirm Delete</div>
	<div>
		<Button color="red" onclick={toggleDeleteOpen}>Cancel</Button>
		<Button color="red" onclick={confirmDelete} value={modalId}>Confirm</Button>
	</div>
</Modal>
<Modal id="editModal" bind:open={editModalOpen} size="xl">
	<h3>Edit Association</h3>
	<div>
		<EditAssoc id={modalId} bind:result={assocEditResult} />
	</div>
	<div>
		<Button color="red" onclick={toggleEditOpen}>Cancel</Button>
		<Button color="red" onclick={confirmEdit} value={modalId}>Confirm</Button>
	</div>
</Modal>
<Modal id="addAssoc" bind:open={addModalAssocOpen} size="xl">
	<h3>Add Association</h3>
	<div>
		<AddAssoc bind:result={assocAddResult} location={id} />
	</div>
	<div>
		<Button color="red" onclick={toggleAddAssocOpen}>Cancel</Button>
		<Button color="red" onclick={confirmAddAssoc} value={modalId}>Confirm</Button>
	</div>
</Modal>
