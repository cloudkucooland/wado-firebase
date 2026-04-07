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
	import { toasts } from 'svelte-toasts';
	import { link } from 'svelte-spa-router';
	import { getContext, onMount } from 'svelte';

	import type { user } from '../model/user';
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
	import type { Editor } from '@tiptap/core';

	import association from '../model/association';
	import prayer from '../model/prayer';
	import hymn from '../model/hymn';
	import psalm from '../model/psalm';
	import antiphon from '../model/antiphon';
	import commemoration from '../model/commemoration';

	// 1. Context & Permissions
	const userContext = getContext<{ details: user }>('me');
	const me = $derived(userContext.details);

	// 2. Props & Routing
	let { params } = $props();
	let id = $derived(params?.id ?? 'exnihilo');

	// 3. Reactive State
	let editorInstance = $state<Editor | null>(null);
	let prayerData = $state<prayer>(new prayer({ Name: 'Loading', Body: 'Loading' }));
	let associations = $state<Array<association>>([]);

	let modalId = $state<string | null>(null);
	let deleteModalOpen = $state(false);
	let editModalOpen = $state(false);
	let addAssocModalOpen = $state(false);

	let assocEditResult = $state<association | null>(null);
	let assocAddResult = $state<association | null>(null);

	const classes = new Map<string, typeof prayer>([
		['antiphon', antiphon],
		['commemoration', commemoration],
		['hymn', hymn],
		['prayer', prayer],
		['psalm', psalm]
	]);

	const classItems = Array.from(classes.keys(), (i) => ({ name: i, value: i }));

	// 4. Lifecycle & Effects
	onMount(() => {
		screenView('Edit Prayer');
	});

	$effect(() => {
		// Re-load whenever the ID in the URL changes
		loadPrayer(id);
	});

	// 5. Data Loading
	async function loadPrayer(targetId: string): Promise<void> {
		if (targetId === 'exnihilo') return;
		try {
			const ref = doc(db, 'prayers/' + targetId);
			const toEdit = await getDoc(ref);
			const d = toEdit.data() as prayerFromFirestore;

			if (!d) throw new Error('Prayer not found: ' + targetId);

			const c = getClass(d.Class);
			prayerData = new c(d);

			const q = query(collection(db, 'associations'), where('Reference', '==', ref));
			const res = await getDocs(q);

			// Map results into our reactive state array
			associations = res.docs.map(
				(a) => new association(a.id, a.data() as associationFromFirestore)
			);

			if (editorInstance) {
				editorInstance.commands.setContent(prayerData.body);
			}
		} catch (err: any) {
			console.error(err);
			toasts.error(err.message);
		}
	}

	// 6. Persistence Logic
	async function saveChanges(): Promise<void> {
		if (!editorInstance) return;
		recordEvent('save_prayer', { id });

		try {
			prayerData.body = editorInstance.getHTML();
			prayerData.lastEditor = auth.currentUser?.displayName || 'Unknown';
			prayerData.lastEdited = new Date().toISOString();
			await setDoc(doc(db, 'prayers', id), prayerData.toFirebase());
			toasts.success('Saved Prayer', id);
		} catch (err: any) {
			console.error(err);
			toasts.error(err.message);
		}
	}

	// 7. Association Management
	function toggleDeleteOpen(e: any): void {
		modalId = e.target.value;
		deleteModalOpen = !deleteModalOpen;
	}

	async function confirmDelete(): Promise<void> {
		if (!modalId) return;
		recordEvent('delete_assoc', { id, assoc: modalId });
		deleteModalOpen = false;

		try {
			await deleteDoc(doc(db, 'associations', modalId));
			associations = associations.filter((a) => a.id !== modalId);
			toasts.success('Association deleted');
		} catch (err: any) {
			toasts.error(err.message);
		}
	}

	function toggleEditOpen(e: any): void {
		modalId = e.target.value;
		editModalOpen = !editModalOpen;
	}

	async function confirmEdit(): Promise<void> {
		if (!modalId || !assocEditResult) return;
		recordEvent('edit_assoc', { id, assoc: modalId });
		editModalOpen = false;

		try {
			await setDoc(doc(db, 'associations', modalId), assocEditResult.toFirebase());
			const index = associations.findIndex((a) => a.id === modalId);
			if (index !== -1) associations[index] = assocEditResult;
			toasts.success('Saved Association');
		} catch (err: any) {
			toasts.error(err.message);
		}
	}

	function toggleAddAssocOpen(): void {
		addAssocModalOpen = !addAssocModalOpen;
	}

	async function confirmAddAssoc(): Promise<void> {
		if (!assocAddResult) return;
		addAssocModalOpen = false;

		try {
			const added = await addDoc(collection(db, 'associations'), assocAddResult.toFirebase());
			const refetched = await getDoc(added);
			associations.push(
				new association(refetched.id, refetched.data() as associationFromFirestore)
			);
			recordEvent('add_assoc', { id, new: added.id });
			toasts.success('Added Association');
		} catch (err: any) {
			toasts.error(err.message);
		}
	}

	function getClass(className: string): typeof prayer {
		const name = className?.toLowerCase() || 'prayer';
		return classes.get(name) || prayer;
	}
</script>

<svelte:head>
	<title>Editing: {prayerData.name}</title>
</svelte:head>

<div class="w-full space-y-6 p-4">
	<div class="flex items-center justify-between">
		<FBHeading tag="h3">{me.isEditor ? 'Editing' : 'Displaying'}: {prayerData.name}</FBHeading>
		{#if me.isEditor}
			<Button color="green" onclick={saveChanges}>Save Changes</Button>
		{/if}
	</div>

	<div class="grid grid-cols-12 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
		<div class="col-span-12">
			<Label for="name" class="mb-2">Name</Label>
			<Input id="name" bind:value={prayerData.name} disabled={!me.isEditor} />
		</div>

		<div class="col-span-12">
			<Label class="mb-2">Body Content</Label>
			{#if me.isEditor}
				<div class="rounded-lg border bg-white dark:bg-gray-800">
					<TextEditor bind:editor={editorInstance} content={prayerData.body}>
						<FormatButtonGroup editor={editorInstance} code={false} highlight={false} />
						<UndoRedoButtonGroup editor={editorInstance} />
						<InvisibleButtonGroup editor={editorInstance} />
					</TextEditor>
				</div>
			{:else}
				<div class="prose max-w-none rounded-lg border bg-white p-4 dark:bg-gray-800">
					{@html prayerData.body}
				</div>
			{/if}
		</div>

		{#if prayerData instanceof hymn}
			<div class="col-span-6">
				<Label for="hymntune">Hymn Tune</Label>
				<Input id="hymntune" bind:value={prayerData.hymntune} disabled={!me.isEditor} />
			</div>
			<div class="col-span-6">
				<Label for="hymnmeter">Meter</Label>
				<Input id="hymnmeter" bind:value={prayerData.hymnmeter} disabled={!me.isEditor} />
			</div>
		{/if}

		{#if prayerData instanceof psalm}
			<div class="col-span-12">
				<Label for="psalmrubric">Psalm Rubric</Label>
				<Input id="psalmrubric" bind:value={prayerData.rubric} disabled={!me.isEditor} />
			</div>
			<div class="col-span-12">
				<EditPsalmAntiphon bind:result={prayerData.antiphon} />
			</div>
		{/if}

		{#if prayerData instanceof commemoration}
			<div class="col-span-6">
				<Label for="commemorationmorningcollect">Morning Collect</Label>
				<Input
					id="commemorationmorningcollect"
					bind:value={prayerData.morningcollect}
					disabled={!me.isEditor}
				/>
			</div>
			<div class="col-span-6">
				<Label for="commemorationeveningcollect">Evening Collect</Label>
				<Input
					id="commemorationeveningcollect"
					bind:value={prayerData.eveningcollect}
					disabled={!me.isEditor}
				/>
			</div>
		{/if}

		<div class="col-span-4">
			<Label for="class">Class</Label>
			<Select id="class" items={classItems} bind:value={prayerData.class} disabled={!me.isEditor} />
		</div>
		<div class="col-span-4">
			<Label for="author">Author</Label>
			<Input id="author" bind:value={prayerData.author} disabled={!me.isEditor} />
		</div>
		<div class="col-span-2">
			<Label for="license">Licensed</Label>
			<Checkbox class="mt-2" bind:checked={prayerData.license} disabled={!me.isEditor} />
		</div>
		<div class="col-span-2">
			<Label for="reviewed">Reviewed</Label>
			<Checkbox class="mt-2" bind:checked={prayerData.reviewed} disabled={!me.isEditor} />
		</div>

		<div class="col-span-6">
			<Label>Last Edited By</Label>
			<Input value={prayerData.lastEditor} disabled />
		</div>
		<div class="col-span-6">
			<Label>Last Edited Date</Label>
			<Input value={prayerData.lastEdited} disabled />
		</div>
	</div>

	<hr class="my-8" />

	<FBHeading tag="h3" class="mb-4">Media</FBHeading>
	<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
		<EditMedia {id} bind:media={prayerData.media} />
	</div>

	<hr class="my-8" />

	<div class="mb-4 flex items-center justify-between">
		<FBHeading tag="h3">Associations</FBHeading>
		{#if me.isEditor}
			<Button color="blue" size="sm" onclick={toggleAddAssocOpen}>Add Association</Button>
		{/if}
	</div>

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell>Location</TableHeadCell>
			<TableHeadCell>Calendar</TableHeadCell>
			<TableHeadCell>Season</TableHeadCell>
			<TableHeadCell>Proper</TableHeadCell>
			<TableHeadCell>Weekday</TableHeadCell>
			<TableHeadCell>Year</TableHeadCell>
			<TableHeadCell>Weight</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each associations as v}
				<TableBodyRow>
					<TableBodyCell
						><a href="/#/editlocation/{v.Location}" class="text-blue-600 hover:underline"
							>{v.Location}</a
						></TableBodyCell
					>
					<TableBodyCell>{v.CalendarDate}</TableBodyCell>
					<TableBodyCell>{v.Season}</TableBodyCell>
					<TableBodyCell>{v.ProperDisplay}</TableBodyCell>
					<TableBodyCell>{v.WeekdayDisplay}</TableBodyCell>
					<TableBodyCell>{v.Year}</TableBodyCell>
					<TableBodyCell>{v.Weight}</TableBodyCell>
					<TableBodyCell>
						{#if me.isEditor}
							<div class="flex gap-2">
								<Button color="alternative" size="xs" onclick={toggleEditOpen} value={v.id}
									>Edit</Button
								>
								<Button color="red" size="xs" onclick={toggleDeleteOpen} value={v.id}>Delete</Button
								>
							</div>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<Modal title="Delete Association" bind:open={deleteModalOpen} size="xs" autoclose>
	<div class="text-center">
		<p class="mb-5 text-lg font-normal text-gray-500">
			Are you sure you want to delete this association?
		</p>
		<Button color="red" onclick={confirmDelete}>Confirm Delete</Button>
		<Button color="alternative">Cancel</Button>
	</div>
</Modal>

<Modal title="Edit Association" bind:open={editModalOpen} size="md">
	<EditAssoc id={modalId} bind:result={assocEditResult} />
	<svelte:fragment slot="footer">
		<Button color="green" onclick={confirmEdit}>Save</Button>
		<Button color="alternative" onclick={() => (editModalOpen = false)}>Cancel</Button>
	</svelte:fragment>
</Modal>

<Modal title="Add Association" bind:open={addAssocModalOpen} size="md">
	<EditAssoc id={modalId} bind:result={assocAddResult} addToID={id} />
	<svelte:fragment slot="footer">
		<Button color="green" onclick={confirmAddAssoc}>Add</Button>
		<Button color="alternative" onclick={() => (addAssocModalOpen = false)}>Cancel</Button>
	</svelte:fragment>
</Modal>
