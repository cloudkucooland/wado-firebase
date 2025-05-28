<script lang="ts">
	import { showMedia, showEdit, showAlt } from '../model/preferences';
	import { onMount, getContext } from 'svelte';
	import type { Readable } from 'svelte/store';
	import type User from '../../types/model/user';
	import { Input, Listgroup, ListgroupItem } from 'flowbite-svelte';
	let me: Readable<User> = getContext('me');

	// does bind not work?
	onMount(() => {
		try {
			const sm = document.getElementById('showMedia') as HTMLInputElement;
			sm.checked = $showMedia;
			const se = document.getElementById('showEdit') as HTMLInputElement;
			se.checked = $showEdit;
			const sa = document.getElementById('showAlt') as HTMLInputElement;
			sa.checked = $showAlt;
		} catch (err) {
			console.log(err);
		}
	});
</script>

<svelte:head>
	<title>WADO User Settings</title>
</svelte:head>

<div class="w-full">
	<h3>Settings</h3>
	<div class="w-full grid-flow-row-dense grid-cols-3">
		<strong>Display</strong>
		<Listgroup>
			<ListgroupItem>
				<strong>Show Media</strong>
				<p>Show controls for playing media files (when available).</p>
				<div>
					<Input
						type="checkbox"
						id="showMedia"
						on:change={(e) => {
							// @ts-ignore
							showMedia.set(e.target.checked);
						}}
					/>
				</div>
			</ListgroupItem>
			<ListgroupItem>
				<strong>Show Alternatives</strong>
				<p>Show additional prayer options (when available).</p>
				<div>
					<Input
						type="checkbox"
						on:change={(e) => {
							// @ts-ignore
							showAlt.set(e.target.checked);
						}}
					/>
				</div>
			</ListgroupItem>
			<ListgroupItem>
				<strong>Show Edit Links</strong>
				<p>Show links to edit prayers & locations.</p>
				<div>
					<Input
						type="checkbox"
						id="showEdit"
						on:change={(e) => {
							// @ts-ignore
							showEdit.set(e.target.checked);
						}}
					/>
				</div>
			</ListgroupItem>
		</Listgroup>
		<strong>Profile</strong>
		<Listgroup>
			<ListgroupItem>
				<strong>Display Name</strong>
				<p>How your name is presented to others.</p>
				<div>
					<Input
						id="displayName"
						on:change={(e) => {
							// @ts-ignore
							$me.setDisplayName(e.target.value);
						}}
						value={$me.displayName}
					/>
				</div>
			</ListgroupItem>
		</Listgroup>
	</div>
</div>
