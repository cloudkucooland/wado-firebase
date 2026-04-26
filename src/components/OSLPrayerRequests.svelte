<script lang="ts">
	import { Spinner } from 'flowbite-svelte';
	import Subheading from './Subheading.svelte';
	import { getContext } from 'svelte';
	import type { prayerRequest } from '../model/types';

	const dateContext = getContext<{ value: string }>('officeDate');
	let currentOffsetDate = $derived(dateContext.value);

	async function loaddata(od: { value: string }): Promise<Array<prayerRequest>> {
		const d = od.value.split('-');
		const month = d[1];
		const day = d[2];

		const cred: RequestCredentials = 'include';
		const mode: RequestMode = 'cors';
		const redirect: RequestRedirect = 'manual';
		const rp: ReferrerPolicy = 'origin';

		const request = {
			method: 'GET',
			mode: mode,
			credential: cred,
			redirect: redirect,
			referrerPolicy: rp
		};

		const response = await fetch(
			`https://saint-luke.net:8443/api/v1/prayers`,
			request
		);
		const payload = await response.json();
		if (response.status != 200) {
			console.log('server returned ', response.status);
			throw new Error(payload.error);
		}
		return payload;
	}
</script>

{#await loaddata(dateContext)}
	<Spinner />
{:then data}
	{#if data.length > 0}
		<Subheading>Prayer Requests</Subheading>
		{#each data as d}
			<div>{d.Content} ({d.OSLName})</div>
		{/each}
	{/if}
{:catch error}
	<h5>Unable to load: {error.message}</h5>
{/await}
