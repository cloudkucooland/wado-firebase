<script lang="ts">
	import { db } from '../firebase';
	// import { Container, Input, Button, Row, Col } from "sveltestrap";
	import { toasts } from 'svelte-toasts';
	import { getDoc, doc } from 'firebase/firestore';
	import { onMount, afterUpdate } from 'svelte';
	import Select from 'svelte-select';
	import { index } from '../meili';
	import type { DocumentReference, DocumentSnapshot, DocumentData } from 'firebase/firestore';

	export let result: DocumentReference;
	let resolved: DocumentData;

	async function loadOptions(searchString: string): Promise<Array<any>> {
		const items: Array<any> = [];

		try {
			const searchresult = await index.search(searchString, {
				attributesToRetrieve: ['fsid', 'Name', 'Class'],
				filter: [['Class = Antiphon']]
			});

			for (const r of searchresult.hits) {
				items.push({ value: r.fsid, label: r.Name, group: r.Class });
			}
		} catch (err) {
			console.log(err);
			toasts.error(err.message);
		}
		return items;
	}

	async function doSelect(e: any): Promise<void> {
		try {
			result = doc(db, 'prayers', e.detail.value);
			console.log(result);
			const snap = await getDoc(result);
			console.log(snap);
			resolved = snap.data();
			console.debug(resolved);
		} catch (err) {
			console.log(err);
			toasts.error(err.message);
		}
	}

	onMount(async () => {
		if (result) {
			try {
				const snap = await getDoc(result);
				resolved = snap.data();
			} catch (err) {
				console.log(err);
				toasts.error(err.message);
			}
		}
	});

	const groupBy = (item: any) => item.group;
</script>

<Row>
	<Col sm="12">
		{#if resolved}
			Antiphon: <a href="#/edit/{result.id}" target="_new">{resolved.Name}</a>
		{/if}
	</Col>
</Row>
<Row>
	<Col sm="2">Antiphon Search:</Col>
	<Col sm="10">
		<Select
			name="antiphon"
			placeholder="search for antiphon"
			{loadOptions}
			on:change={doSelect}
			{groupBy}
		/>
	</Col>
</Row>
