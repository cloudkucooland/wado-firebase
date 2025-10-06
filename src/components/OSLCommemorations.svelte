<script lang="ts">
	import { Spinner } from 'flowbite-svelte';
	import Subheading from './Subheading.svelte';
	import { getContext } from 'svelte';

	let officeDate: Readable<string> = getContext('officeDate');

	async function loaddata(od: string): Promise<Array<any>> {
		const d = od.split('-');
		const month = d[1];
		const day = d[2];

		// hurrah typescript...
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
			`https://saint-luke.net:8443/api/v1/commemorations?month=${month}&day=${day}`,
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

{#await loaddata(officeDate)}
	<Spinner />
{:then data}
	{#if data.length > 0}
		<Subheading>OSL Commemorations for Today</Subheading>
		{#each data as d}
			<div>{d.OSLName}: {d.Locality}, {d.Country} - d. {d.Year}</div>
		{/each}
	{/if}
{:catch error}
	<h5>Unable to load: {error.message}</h5>
{/await}
