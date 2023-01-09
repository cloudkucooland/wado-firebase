<script lang="ts">
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import antiphon from "../../model/antiphon";
  import type { prayerFromFirestore } from "../../model/types";

  export let data: prayerFromFirestore;
  export let id: string;

  const ant = new antiphon(data);
  ant.id = id;
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
