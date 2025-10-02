<script lang="ts">
	import {
		Card,
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
	import { onMount, getContext } from 'svelte';
	import type { Readable } from 'svelte/store';
	import type User from '../../types/model/user';
	import { toasts } from 'svelte-toasts';
	import { push } from 'svelte-spa-router';
	import type { prayerFromFirestore } from '../model/types';

	// @ts-ignore
	export let params = { c };
	$: prayerClass = params.c ? params.c : 'prayer';
	const _pp: Map<string, prayer> = new Map();
	$: prayers = _pp;
	let modalId: string = 'exnihilo';
	let me: Readable<User> = getContext('me');

	const cs = new Array('prayer', 'hymn', 'psalm', 'antiphon', 'commemoration');

	$: deleteModalOpen = false;
	function toggleDeleteOpen(e: Event): void {
		screenView('toggleDeleteOpen');
		deleteModalOpen = !deleteModalOpen;
		const t = e.target as HTMLInputElement;
		if (deleteModalOpen) modalId = t.value;
	}

	async function confirmDelete(e: Event): Promise<void> {
		const t = e.target as HTMLInputElement;
		recordEvent('delete_prayer', { id: t.value });
		deleteModalOpen = !deleteModalOpen;

		try {
			const toDelete = doc(db, 'prayers', t.value);

			const q = query(
				collection(db, 'associations'),
				where('Reference', '==', doc(db, 'prayers', t.value))
			);
			const res = await getDocs(q);
			for (const asn of res.docs) {
				await deleteDoc(doc(db, 'associations', asn.id));
			}

			await deleteDoc(toDelete);
		} catch (err: any) {
			console.log(err);
			toasts.error(err.message);
		}

		// refresh screen
		const newPrayers: Map<string, prayer> = new Map();
		for (const [k, p] of prayers) {
			if (k != t.value) {
				newPrayers.set(k, p);
			}
		}
		prayers = newPrayers;
		toasts.success('Prayer deleted', t.value);
	}

	// https://github.com/firebase/snippets-web/blob/36740fb2c39383621c0c0a948236e9eab8a71516/snippets/firestore-next/test-firestore/paginate.js#L8-L23
	async function loadClass(pc: string) {
		const progressBar = toasts.success('Loading Data', pc, { duration: 0 });

		const m = new Map();
		try {
			const q = query(collection(db, 'prayers'), where('Class', '==', pc), orderBy('Name'));
			const res = await getDocs(q);
			for (const a of res.docs) {
				const ta = a.data() as prayerFromFirestore;
				const p = new prayer(ta);
				m.set(a.id, p);
			}
		} catch (e) {
			console.log(e);
		}
		progressBar.remove();
		return m;
	}

	onMount(async () => {
		prayers = await loadClass(prayerClass);
		screenView('Prayer List');
	});
</script>

<svelte:head>
	<title>WADO Prayer List: {prayerClass}</title>
</svelte:head>

<div class="w-full">
	<div>
		{#each cs as cx}
			<a
				href="#/prayers/{cx}/"
				onclick={async () => {
					prayers = await loadClass(cx);
				}}>{cx}</a
			> &nbsp;
		{/each}
	</div>
	<h3>{prayerClass}</h3>
	<div>
		<Table>
			<TableHead>
				<TableHeadCell>Prayer</TableHeadCell>
				<TableHeadCell>Licensed</TableHeadCell>
				<TableHeadCell>Reviewed</TableHeadCell>
				<TableHeadCell>&nbsp;</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each [...prayers] as [k, v]}
					<TableBodyRow id={k}>
						<TableBodyCell>
							<a href="#/edit/{k}" target="_blank" rel="noopener noreferrer">
								{v.name}
							</a>
						</TableBodyCell>
						<TableBodyCell>{v.license}</TableBodyCell>
						<TableBodyCell>{v.reviewed}</TableBodyCell>
						<TableBodyCell>
							{#if $me.isEditor}
								<Button onclick={toggleDeleteOpen} value={k} color="red">Delete</Button>
							{/if}
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
<Modal id="deleteModal" bind:open={deleteModalOpen}>
	<FBHeading tag="h3">Delete Prayer</FBHeading>
	<div>Confirm Delete</div>
	<div>
		<Button color="red" onclick={toggleDeleteOpen}>Cancel</Button>
		<Button color="red" onclick={confirmDelete} value={modalId}>Confirm</Button>
	</div>
</Modal>
