<script lang="ts">
	import { showMedia, showEdit, showAlt } from '../model/preferences';
	import { onMount, getContext } from 'svelte';
	import type { Readable } from 'svelte/store';
	import type User from '../../types/model/user';
	import { Heading, Input, Checkbox, Listgroup, ListgroupItem } from 'flowbite-svelte';
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

<div class="grid w-full">
	<Heading tag="h2">Settings</Heading>
	<Heading tag="h3">Display</Heading>
	<Listgroup class="w-full">
		<ListgroupItem>
			<div class="w-full">
				<strong>Show Media</strong> Show controls for playing media files (when available).
			</div>
			<div>
				<Checkbox
					id="showMedia"
					onchange={(e) => {
						// @ts-ignore
						showMedia.set(e.target.checked);
					}}
				/>
			</div>
		</ListgroupItem>
		<ListgroupItem>
			<div class="w-full">
				<strong>Show Alternatives</strong> Show additional prayer options (when available).
			</div>
			<div>
				<Checkbox
					id="showAlt"
					onchange={(e) => {
						// @ts-ignore
						showAlt.set(e.target.checked);
					}}
				/>
			</div>
		</ListgroupItem>
		<ListgroupItem>
			<div class="w-full">
				<strong>Show Edit Links</strong> Show links to edit prayers & locations.
			</div>
			<div>
				<Checkbox
					id="showEdit"
					onchange={(e) => {
						// @ts-ignore
						showEdit.set(e.target.checked);
					}}
				/>
			</div>
		</ListgroupItem>
	</Listgroup>
	<Heading tag="h3">Profile</Heading>
	<Listgroup class="w-full">
		<ListgroupItem>
			<div class="w-full">
				<strong>Display Name</strong> How your name is presented to others.
			</div>
			<div>
				<Input
					id="displayName"
					onchange={(e) => {
						// @ts-ignore
						$me.setDisplayName(e.target.value);
					}}
					value={$me.displayName}
				/>
			</div>
		</ListgroupItem>
	</Listgroup>
</div>
