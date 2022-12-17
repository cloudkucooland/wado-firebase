<script lang="ts">
  import { showMedia } from "../model/preferences";
  export let mediaUrl: string;
</script>

{#if $showMedia == true && mediaUrl != ""}
  <audio controls preload="metadata"><source src={mediaUrl} /></audio>
{/if}
