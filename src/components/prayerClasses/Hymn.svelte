<script lang="ts">
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import hymn from "../../model/hymn";
  import type { prayerFromFirestore } from "../../model/types";
  import type { Readable } from "svelte/store";
  import { getContext } from "svelte";
  import { Icon } from "sveltestrap";

  export let data: prayerFromFirestore;
  export let id: string;

  const h = new hymn(data);
  h.id = id;
  const qe: Readable<any> = getContext("qe");
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}" target="_new">
      <Icon name="pencil" />
    </a>
    <i class="bi-pencil-square" on:click={$qe(h)} />
  </div>{/if}
<h5>{h.name}</h5>
<div class="hymn">{@html h.body}</div>
<div class="hymndata">
  {#if h.hymntune}
    <span class="hymntune">{h.hymntune}</span>
  {/if}
  {#if h.hymnmeter}
    <span class="hymnmeter">{h.hymnmeter}</span>
  {/if}
</div>
<Media mediaUrl={h.media} />
