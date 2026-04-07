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
		Heading as FBHeading
	} from 'flowbite-svelte';
	import { collection, query, where, doc, deleteDoc, orderBy, getDocs } from 'firebase/firestore';
	import { db, recordEvent, screenView } from '../firebase';
	import prayer from '../model/prayer';
	import { getContext } from 'svelte';
	import { toasts } from 'svelte-toasts';
	import type { prayerFromFirestore } from '../model/types';
	import type { user } from '../model/user';

	// 1. Svelte 5 Props
	let { params = { c: 'prayer' } } = $props();

	// 2. Reactive State for the list
	let prayers = $state(new Map<string, prayer>());
	let deleteModalOpen = $state(false);
	let modalId = $state('exnihilo');

	const userContext = getContext<{ details: user }>('me');
	const prayerClasses = ['prayer', 'hymn', 'psalm', 'antiphon', 'commemoration'];

	// 3. Derived value for the current class
	let prayerClass = $derived(params.c || 'prayer');

	async function loadClass(pc: string) {
		const progressBar = toasts.success('Loading Data', pc, { duration: 0 });
		const m = new Map();
		try {
			const q = query(collection(db, 'prayers'), where('Class', '==', pc), orderBy('Name'));
			const res = await getDocs(q);
			for (const a of res.docs) {
				const ta = a.data() as prayerFromFirestore;
				m.set(a.id, new prayer(ta));
			}
			prayers = m; // Assign to the $state variable
		} catch (e: any) {
			toasts.error(e.message);
		} finally {
			progressBar.remove();
		}
	}

	// 4. Use an effect to load data when the URL param changes
	$effect(() => {
		loadClass(prayerClass);
		screenView(`Prayer List: ${prayerClass}`);
	});

	function openDeleteModal(id: string) {
		modalId = id;
		deleteModalOpen = true;
	}

	async function confirmDelete(): Promise<void> {
		const targetId = modalId;
		recordEvent('delete_prayer', { id: targetId });
		deleteModalOpen = false;

		try {
			// Delete associations first
			const q = query(
				collection(db, 'associations'),
				where('Reference', '==', doc(db, 'prayers', targetId))
			);
			const res = await getDocs(q);
			const batchDeletes = res.docs.map((asn) => deleteDoc(doc(db, 'associations', asn.id)));
			await Promise.all(batchDeletes);

			// Delete the prayer
			await deleteDoc(doc(db, 'prayers', targetId));

			// 5. Update state: Just delete from the map!
			// Svelte 5 proxies make this reactive.
			prayers.delete(targetId);

			toasts.success('Prayer deleted', targetId);
		} catch (err: any) {
			toasts.error(err.message);
		}
	}
</script>

<svelte:head>
	<title>WADO Prayer List: {prayerClass}</title>
</svelte:head>

<div class="w-full p-4">
	<div class="mb-4 flex gap-4">
		{#each prayerClasses as cx}
			<a
				href="#/prayers/{cx}/"
				class="capitalize hover:underline {prayerClass === cx ? 'font-bold text-blue-600' : ''}"
			>
				{cx}
			</a>
		{/each}
	</div>

	<FBHeading tag="h3" class="mb-4 capitalize">{prayerClass}s</FBHeading>

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell>Prayer</TableHeadCell>
			<TableHeadCell>Licensed</TableHeadCell>
			<TableHeadCell>Reviewed</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each [...prayers] as [id, p]}
				<TableBodyRow>
					<TableBodyCell>
						<a href="#/edit/{id}" class="text-blue-500 hover:underline">
							{p.name}
						</a>
					</TableBodyCell>
					<TableBodyCell>{p.license ? '✅' : '❌'}</TableBodyCell>
					<TableBodyCell>{p.reviewed ? '✅' : '⏳'}</TableBodyCell>
					<TableBodyCell>
						{#if userContext.details.isEditor}
							<Button onclick={() => openDeleteModal(id)} color="red" size="xs">Delete</Button>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<Modal title="Confirm Deletion" bind:open={deleteModalOpen} size="xs" autoclose>
	<div class="text-center">
		<p class="mb-5 text-lg font-normal text-gray-500">
			Are you sure you want to delete this prayer and all its associations?
		</p>
		<Button color="red" class="me-2" onclick={confirmDelete}>Yes, I'm sure</Button>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>
