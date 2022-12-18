<script lang="ts">
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import antiphon from "../../model/antiphon";

  export let data: string;
  export let id: string;

  const ant = new antiphon(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {ant.name}]</a>
  </div>{/if}
<h6>Antiphon</h6>
<div class="antiphon">{@html ant.body}</div>
{#if ant.author}
  <div class="antiphon-credit">{ant.author}</div>
{/if}
<Media mediaUrl={ant.media} />
