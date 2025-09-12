<script lang="ts">
	import {
		Checkbox,
		Input,
		Heading as FBHeading,
		Label,
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		Button,
		Modal,
		Select
	} from 'flowbite-svelte';
	import {
		collection,
		query,
		where,
		getDocs,
		getDoc,
		doc,
		addDoc,
		setDoc,
		deleteDoc
	} from 'firebase/firestore';
	import { db, auth, recordEvent, screenView } from '../firebase';
	import { classes, getClass, type prayerClass } from '../model/prayerClasses';
	import { toasts } from 'svelte-toasts';
	import { link } from 'svelte-spa-router';
	import { getContext, onMount, onDestroy } from 'svelte';
	import type { Readable } from 'svelte/store';
	import type User from '../../types/model/user';
	import type { prayerFromFirestore, associationFromFirestore } from '../model/types';
	import EditMedia from './EditMedia.svelte';
	import EditAssoc from './EditAssoc.svelte';
	import EditPsalmAntiphon from './EditPsalmAntiphon.svelte';

	import {
		FormatButtonGroup,
		TextEditor,
		InvisibleButtonGroup,
		UndoRedoButtonGroup
	} from '@flowbite-svelte-plugins/texteditor';
	import { Editor } from '@tiptap/core';

	import association from '../model/association';
	import prayer from '../model/prayer';
	import hymn from '../model/hymn';
	import psalm from '../model/psalm';
	import type antiphon from '../model/antiphon';
	import commemoration from '../model/commemoration';

	let me: Readable<User> = getContext('me');

	let editorInstance = $state<Editor | null>(null);
	let isEditable = $state<boolean>(true);

	function handleEditableToggle(editable: boolean) {
		isEditable = editable;
		console.log('Editor is now:', editable ? 'editable' : 'read-only');
	}

	onMount(async () => {
		screenView('Edit Prayer');
		await loadPrayer();
	});

	const classItems = Array.from(classes.keys(), (i) => {
		return { name: i, value: i };
	});

	// @ts-ignore
	const { params } = $props();
	const id: string = params.id ? params.id : 'exnihilo';
	let modalId = $state<string | null>(null);
	let assocEditResult = $state<assocation | null>(null);
	let assocAddResult = $state<association | null>(null);
	const _p: prayer | hymn | psalm | antiphon | commemoration = new prayer({
		Name: 'Loading',
		Body: 'Loading'
	});
	let prayerData = $state<prayer>(_p);
	const _a: Array<association> = new Array();
	let associations = $state<Array<association>>(_a);

	let deleteModalOpen = $state<boolean>(false);
	function toggleDeleteOpen(e: Event): void {
		const t = e.target as HTMLInputElement;
		screenView('toggleDeleteOpen');
		deleteModalOpen = !deleteModalOpen;
		if (deleteModalOpen) modalId = t.value;
	}

	async function confirmDelete(e: Event): Promise<void> {
		const t = e.target as HTMLInputElement;
		recordEvent('delete_assoc', { id: id, assoc: t.value });
		deleteModalOpen = !deleteModalOpen;

		try {
			await deleteDoc(doc(db, 'associations', t.value));
		} catch (err: Error) {
			console.log(err);
			toasts.error(err.message);
		}
		const newAssn: Array<association> = new Array();
		for (const a of associations) {
			if (a.id != t.value) newAssn.push(a);
		}
		associations = newAssn;
		toasts.success('Association deleted', t.value);
	}

	let editModalOpen = $state<boolean>(false);
	async function toggleEditOpen(e: Event): Promise<void> {
		const t = e.target as HTMLInputElement;
		screenView('toggleEditOpen');
		editModalOpen = !editModalOpen;

		if (editModalOpen) modalId = t.value;
	}

	async function confirmEdit(e: Event): Promise<void> {
		const t = e.target as HTMLInputElement;
		recordEvent('edit_assoc', { id: id, assoc: t.value });
		editModalOpen = !editModalOpen;

		try {
			await setDoc(doc(db, 'associations', t.value), assocEditResult.toFirebase());
			const newAssn: Array<association> = new Array();
			for (const a of associations) {
				if (a.id != t.value) newAssn.push(a);
			}
			newAssn.push(assocEditResult);
			associations = newAssn;
			toasts.success('Saved Association', t.value);
		} catch (err: Error) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	let addAssocModalOpen = $state<boolean>(false);
	async function toggleAddAssocOpen(e: Event): Promise<void> {
		console.log(e);
		const t = e.target as HTMLInputElement;
		screenView('toggleAddAssocOpen');
		addAssocModalOpen = !addAssocModalOpen;

		if (addAssocModalOpen) modalId = t.value;
	}

	async function confirmAddAssoc(): Promise<void> {
		addAssocModalOpen = !addAssocModalOpen;

		try {
			const added = await addDoc(collection(db, 'associations'), assocAddResult.toFirebase());
			const refetched = await getDoc(added);
			// https://svelte.dev/tutorial/updating-arrays-and-objects
			associations = [
				...associations,
				new association(refetched.id, refetched.data() as associationFromFirestore)
			];
			recordEvent('add_assoc', { id: id, new: added.id });
		} catch (err: Error) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	async function loadPrayer(): Promise<void> {
		try {
			const ref = doc(db, 'prayers/' + id);
			const toEdit = await getDoc(ref);
			const d = toEdit.data() as prayerFromFirestore;
			if (!d) {
				throw new Error('prayer not found: ' + id);
			}

			const c: prayerClass = getClass(d.Class);
			prayerData = new c(d);

			const q = query(collection(db, 'associations'), where('Reference', '==', ref));
			const res = await getDocs(q);
			for (const a of res.docs) {
				// https://svelte.dev/tutorial/updating-arrays-and-objects
				associations = [
					...associations,
					new association(a.id, a.data() as associationFromFirestore)
				];
			}
			editorInstance.commands.setContent(prayerData.body);
		} catch (err: any) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	async function saveChanges(): Promise<void> {
		recordEvent('save_prayer', { id: id });

		try {
			prayerData.body = editorInstance.getHTML();
			prayerData.lastEditor = auth.currentUser.displayName;
			prayerData.lastEdited = new Date().toISOString();
			await setDoc(doc(db, 'prayers', id), prayerData.toFirebase());
			toasts.success('Saved Prayer', id);
		} catch (err: Error) {
			console.error(err);
			toasts.error(err.message);
		}
	}
</script>

<svelte:head>
	<title>Editing: {prayerData.name}</title>
</svelte:head>

<div class="w-full">
	{#if $me.isEditor}
		<FBHeading tag="h3">Editing: {prayerData.name}</FBHeading>
	{:else}
		<FBHeading tag="h3">Displaying: {prayerData.name}</FBHeading>
	{/if}
	<div class="w-full grid-flow-row-dense grid-cols-12">
		<div class="col-span-12">
			<Label for="name">Name</Label>
			<Input name="name" id="name" bind:value={prayerData.name} disabled={!$me.isEditor} />
		</div>
		<div class="col-span-12">
			{#if $me.isEditor}
				<TextEditor
					bind:editor={editorInstance}
					content={prayerData.body}
					contentprops={{ id: 'formats-ex' }}
				>
					<FormatButtonGroup
						editor={editorInstance}
						code={false}
						highlight={false}
						link={false}
						removeLink={false}
						strike={false}
						subscript={false}
						superscript={false}
					/>
					<UndoRedoButtonGroup editor={editorInstance} />
					<InvisibleButtonGroup editor={editorInstance} />
				</TextEditor>
			{:else}
				<p>{@html prayerData.body}</p>
			{/if}
		</div>
		{#if prayerData instanceof hymn}
			<div class="col-span-6">
				<Label for="hymntune">Hymn Tune</Label>
				<Input
					name="hymntune"
					id="hymntune"
					bind:value={prayerData.hymntune}
					disabled={!$me.isEditor}
				/>
			</div>
			<div class="col-span-6">
				<Label for="hymnmeter">Meter</Label>
				<Input
					name="hymnmeter"
					id="hymnmeter"
					bind:value={prayerData.hymnmeter}
					disabled={!$me.isEditor}
				/>
			</div>
		{/if}
		{#if prayerData instanceof psalm}
			<div>
				<Label for="psalmrubric">Psalm Rubric</Label>
				<Input
					name="psalmrubric"
					id="psalmrubric"
					bind:value={prayerData.rubric}
					disabled={!$me.isEditor}
				/>
			</div>
			<EditPsalmAntiphon bind:result={prayerData.antiphon} />
		{/if}
		{#if prayerData instanceof commemoration}
			<div>
				<Label for="commemorationmorningcollect">Commemoration Morning Collect</Label>
				<Input
					name="commemorationmorningcollect"
					id="commemorationmorningcollect"
					bind:value={prayerData.morningcollect}
					disabled={!$me.isEditor}
				/>
			</div>
			<div>
				<Label for="commemorationeveningcollect">Commemoration Evening Collect</Label>
				<Input
					name="commemorationeveningcollect"
					id="commemorationeveningcollect"
					bind:value={prayerData.eveningcollect}
					disabled={!$me.isEditor}
				/>
			</div>
		{/if}
		<div class="col-span-3">
			<Label for="class">Class</Label>
			<Select
				name="class"
				id="class"
				bind:value={prayerData.class}
				disabled={!$me.isEditor}
				items={classItems}
			/>
		</div>
		<div class="col-span-3">
			<Label for="author">Author</Label>
			<Input name="author" id="author" bind:value={prayerData.author} disabled={!$me.isEditor} />
			<div class="col-span-3">
				<Label for="lastEditor">Last Editor</Label>
				<Input
					name="lastEditor"
					disabled={true}
					id="lastEditor"
					bind:value={prayerData.lastEditor}
				/>
			</div>
			<div class="col-span-3">
				<Label for="lastEdited" type="date">Last Edited</Label>
				<Input
					name="lastEdited"
					disabled={true}
					id="lastEdited"
					bind:value={prayerData.lastEdited}
				/>
			</div>
			<div class="col-span-2">
				<Label for="license">License</Label>
				<Checkbox
					name="license"
					id="license"
					bind:checked={prayerData.license}
					disabled={!$me.isEditor}
				/>
			</div>
			<div class="col-span-2">
				<Label for="reviewed">Reviewed</Label>
				<Checkbox
					name="reviewed"
					id="reviewed"
					bind:checked={prayerData.reviewed}
					disabled={!$me.isEditor}
				/>
			</div>
			<div class="col-span-7">&nbsp;</div>
			<div class="col-span-1">
				{#if $me.isEditor}
					<Button color="red" onclick={saveChanges}>Save</Button>
				{/if}
			</div>
		</div>
	</div>
</div>
<div>
	<FBHeading tag="h3">Media</FBHeading>
	<div>
		<EditMedia {id} media={prayerData.media} />
	</div>
</div>
<div>
	<FBHeading tag="h3">Associations</FBHeading>
	<Table>
		<TableHead>
			<TableHeadCell>Location</TableHeadCell>
			<TableHeadCell>Calendar Date</TableHeadCell>
			<TableHeadCell>Season</TableHeadCell>
			<TableHeadCell>Proper</TableHeadCell>
			<TableHeadCell>Weekday</TableHeadCell>
			<TableHeadCell>Lectionary Year</TableHeadCell>
			<TableHeadCell>Weight</TableHeadCell>
			<TableHeadCell>&nbsp;</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each associations as v}
				<TableBodyRow id={v.id}>
					<TableBodyCell>
						<a href="/editlocation/{v.Location}" use:link>{v.Location}</a>
					</TableBodyCell>
					<TableBodyCell>{v.CalendarDate}</TableBodyCell>
					<TableBodyCell>{v.Season}</TableBodyCell>
					<TableBodyCell>{v.ProperDisplay}</TableBodyCell>
					<TableBodyCell>{v.WeekdayDisplay}</TableBodyCell>
					<TableBodyCell>{v.Year}</TableBodyCell>
					<TableBodyCell>{v.Weight}</TableBodyCell>
					<TableBodyCell>
						{#if $me.isEditor}
							<Button color="red" onclick={toggleEditOpen} value={v.id}>Edit</Button>
							<Button color="red" onclick={toggleDeleteOpen} value={v.id}>delete</Button>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
	{#if $me.isEditor}
		<Button color="red" onclick={toggleAddAssocOpen}>Add</Button>
	{/if}
</div>
<Modal id="deleteModal" bind:open={deleteModalOpen} backdrop="static">
	<FBHeading tag="h3">Delete Association</FBHeading>
	<div>Confirm Delete</div>
	<div>
		<Button color="red" onclick={toggleDeleteOpen}>Cancel</Button>
		<Button color="red" onclick={confirmDelete} value={modalId}>Confirm</Button>
	</div>
</Modal>
<Modal id="editModal" bind:open={editModalOpen}>
	<FBHeading tag="h3">Edit Association</FBHeading>
	<div>
		<EditAssoc id={modalId} bind:result={assocEditResult} />
	</div>
	<div>
		<Button color="red" onclick={toggleEditOpen}>Cancel</Button>
		<Button color="red" onclick={confirmEdit} value={modalId}>Confirm</Button>
	</div>
</Modal>
<Modal id="addAssocModal" bind:open={addAssocModalOpen}>
	<FBHeading tag="h3">Add Association</FBHeading>
	<div>
		<EditAssoc id={modalId} bind:result={assocAddResult} addToID={id} />
	</div>
	<div>
		<Button color="red" onclick={toggleAddAssocOpen}>Cancel</Button>
		<Button color="red" onclick={confirmAddAssoc} value={modalId}>Confirm</Button>
	</div>
</Modal>
