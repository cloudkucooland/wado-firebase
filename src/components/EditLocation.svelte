<script lang="ts">
	// import { Container, Row, Col, Card, CardHeader, CardBody, CardFooter, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, } from "sveltestrap";
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

	let deleteModalOpen: boolean = false;
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
		} catch (err) {
			console.log(err);
			toasts.error(err.message);
		}
		const newAssn: Map<string, association> = new Map();
		for (const [k, a] of associations) {
			if (k != t.value) newAssn.set(k, a);
		}
		associations = newAssn;
		toasts.success('Association deleted', t.value);
	}

	let editModalOpen = false;
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
		} catch (error) {
			console.log(error);
			toasts.error(error.message);
		}
	}

	let addModalAssocOpen = false;
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
		} catch (err) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	async function loadLocation(id: string): Promise<void> {
		const progressBar = toasts.success('Loading Data', id, { duration: 0 });
		let res: unknown; // FIXME

		const newAssn: Map<string, association> = new Map();
		try {
			const q = query(collection(db, 'associations'), where('Location', '==', id));
			res = await getDocs(q);
		} catch (error) {
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
				} catch (err) {
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
				} catch (err) {
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
			} catch (err) {
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

<Container>
	<Row>
		<Col>
			<Form>
				<FormGroup>
					<Label for="locations">Location</Label>
					<Input
						type="select"
						name="locations"
						on:change={(e) => {
							// @ts-ignore
							id = e.target.value;
							push('/editlocation/' + id);
							loadLocation(id);
						}}
					>
						<option>Any</option>
						{#each association.locations as L}
							<option>{L}</option>
						{/each}
					</Input>
				</FormGroup>
			</Form>
		</Col>
	</Row>
	<Row>
		<Col>
			<Card>
				<CardHeader>Associations for {id}</CardHeader>
				<CardBody>
					<Table>
						<thead>
							<tr>
								<th>Prayer</th>
								<th>Calendar Date</th>
								<th>Season</th>
								<th>Proper</th>
								<th>Weekday</th>
								<th>Lectionary Year</th>
								<th>Weight</th>
								<th>&nbsp;</th>
								<th>&nbsp;</th>
							</tr>
						</thead>
						<tbody>
							{#each [...associations] as [k, v]}
								<tr id={k} class={v.dirtyStyle}>
									<td>
										<a href="#/edit/{v.Reference.id}">
											{v._PrayerName}
										</a>
									</td>
									<td>{v.CalendarDate}</td>
									<td>{v.Season}</td>
									<td>{v.ProperDisplay}</td>
									<td>{v.WeekdayDisplay}</td>
									<td>{v.Year}</td>
									<td>{v.Weight}</td>
									<td>
										<Button on:click={toggleEditOpen} value={k} color="warning">Edit</Button>
									</td>
									<td>
										<Button on:click={toggleDeleteOpen} value={k} color="warning">Delete</Button>
									</td>
								</tr>
							{/each}
						</tbody>
					</Table>
				</CardBody>
				<CardFooter>
					<Button size="sm" color="success" on:click={toggleAddAssocOpen}>Add</Button>
				</CardFooter>
			</Card>
		</Col>
	</Row>
</Container>
<Modal id="deleteModal" isOpen={deleteModalOpen} backdrop="static">
	<ModalHeader>Delete Association</ModalHeader>
	<ModalBody>Confirm Delete</ModalBody>
	<ModalFooter>
		<Button color="primary" size="sm" on:click={toggleDeleteOpen}>Cancel</Button>
		<Button color="warning" size="sm" on:click={confirmDelete} value={modalId}>Confirm</Button>
	</ModalFooter>
</Modal>
<Modal id="editModal" isOpen={editModalOpen} size="xl">
	<ModalHeader>Edit Association</ModalHeader>
	<ModalBody>
		<EditAssoc id={modalId} bind:result={assocEditResult} />
	</ModalBody>
	<ModalFooter>
		<Button color="secondary" size="sm" on:click={toggleEditOpen}>Cancel</Button>
		<Button color="success" size="sm" on:click={confirmEdit} value={modalId}>Confirm</Button>
	</ModalFooter>
</Modal>
<Modal id="addAssoc" isOpen={addModalAssocOpen} size="xl">
	<ModalHeader>Add Association</ModalHeader>
	<ModalBody>
		<AddAssoc bind:result={assocAddResult} location={id} />
	</ModalBody>
	<ModalFooter>
		<Button color="secondary" size="sm" on:click={toggleAddAssocOpen}>Cancel</Button>
		<Button color="success" size="sm" on:click={confirmAddAssoc} value={modalId}>Confirm</Button>
	</ModalFooter>
</Modal>

<style>
	tr.dirty {
		background-color: yellow !important;
	}
</style>
