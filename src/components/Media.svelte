<script lang="ts">
	import { prefs } from '../model/preferences.svelte';
	export let mediaUrl: string;
</script>

{#if prefs.showMedia == true && mediaUrl != ''}
	<audio controls preload="metadata"><source src={mediaUrl} /></audio>
{/if}
