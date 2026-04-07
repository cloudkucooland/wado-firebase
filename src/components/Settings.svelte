<script lang="ts">
	import { prefs } from '../model/preferences.svelte';
	import { getContext } from 'svelte';
	import { Heading as FBHeading, Input, Checkbox, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import type { user } from '../model/user'; // Using your local model type

	// Consume the reactive user context we set up in App.svelte
	const userContext = getContext<{ details: user }>('me');
	const me = $derived(userContext.details);
</script>

<svelte:head>
	<title>WADO User Settings</title>
</svelte:head>

<div class="grid w-full space-y-6">
	<FBHeading tag="h2">Settings</FBHeading>

	<FBHeading tag="h3">Display</FBHeading>
	<Listgroup class="w-full">
		<ListgroupItem class="flex items-center justify-between">
			<div class="pr-4">
				<p><strong>Show Media</strong></p>
				<p class="text-sm text-gray-500">Show controls for playing media files (when available).</p>
			</div>
			<Checkbox bind:checked={prefs.showMedia} />
		</ListgroupItem>

		<ListgroupItem class="flex items-center justify-between">
			<div class="pr-4">
				<p><strong>Show Alternatives</strong></p>
				<p class="text-sm text-gray-500">
					Show additional prayer options. (Press <kbd>A</kbd> in an office to toggle)
				</p>
			</div>
			<Checkbox bind:checked={prefs.showAlt} />
		</ListgroupItem>

		<ListgroupItem class="flex items-center justify-between">
			<div class="pr-4">
				<p><strong>Show Edit Links</strong></p>
				<p class="text-sm text-gray-500">
					Show links to edit prayers & locations. (Press <kbd>L</kbd> in an office to toggle)
				</p>
			</div>
			<Checkbox bind:checked={prefs.showEdit} />
		</ListgroupItem>
	</Listgroup>

	<FBHeading tag="h3">Profile</FBHeading>
	<Listgroup class="w-full">
		<ListgroupItem class="flex flex-col items-start gap-2">
			<div class="w-full">
				<p><strong>Display Name</strong></p>
				<p class="text-sm text-gray-500">How your name is presented to others.</p>
			</div>
			<Input
				id="displayName"
				placeholder="Enter display name"
				value={me.displayName}
				onchange={(e: any) => {
					me.setDisplayName(e.target.value);
				}}
			/>
		</ListgroupItem>
	</Listgroup>
</div>
