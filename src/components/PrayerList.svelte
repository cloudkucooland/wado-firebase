<script lang="ts">
	import { Card, Table, Button, Modal } from 'flowbite-svelte';
	import {
		collection,
		query,
		where,
		doc,
		getDocs,
		deleteDoc,
		orderBy
		// getCountFromServer,
	} from 'firebase/firestore';
	import {
		db,
		recordEvent,
		screenView
		// getDocsCacheFirst,
	} from '../firebase';
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

	let deleteModalOpen = false;
	function toggleDeleteOpen(e: Event) {
		screenView('toggleDeleteOpen');
		deleteModalOpen = !deleteModalOpen;
		const t = e.target as HTMLInputElement;
		if (deleteModalOpen) modalId = t.value;
	}

	async function confirmDelete(e: Event) {
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
		} catch (err) {
			console.log(err);
			toasts.error(err.message);
		}
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
				on:click={async () => {
					prayers = await loadClass(cx);
				}}>{cx}</a
			>
		{/each}
		<div>
			<Button
				on:click={() => {
					push('/addPrayer');
				}}
				color="success">Add Prayer</Button
			>
		</div>
	</div>
	<Row>
		<Col>
			<Card>
				<h3>{prayerClass}</h3>
				<div>
					<Table>
						<thead>
							<tr>
								<th>Prayer</th>
								<th>Licensed</th>
								<th>Reviewed</th>
								<th>&nbsp;</th>
							</tr>
						</thead>
						<tbody>
							{#each [...prayers] as [k, v]}
								<tr id={k}>
									<td>
										<a href="#/edit/{k}" target="_blank" rel="noopener noreferrer">
											{v.name}
										</a>
									</td>
									<td>{v.license}</td>
									<td>{v.reviewed}</td>
									<td>
										{#if $me.isEditor}
											<Button on:click={toggleDeleteOpen} value={k} color="warning">Delete</Button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</Table>
				</div>
			</Card>
		</Col>
	</Row>
</div>
<Modal id="deleteModal" isOpen={deleteModalOpen} backdrop="static">
	<h3>Delete Prayer</h3>
	<div>Confirm Delete</div>
	<div>
		<Button color="primary" size="sm" on:click={toggleDeleteOpen}>Cancel</Button>
		<Button color="warning" size="sm" on:click={confirmDelete} value={modalId}>Confirm</Button>
	</div>
</Modal>
