<script lang="ts">
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import prayer from "../../model/prayer";
  import type { prayerFromFirestore } from "../../model/types";
  import type { Readable } from "svelte/store";
  import { getContext } from "svelte";
  import { Icon } from "sveltestrap";

  export let data: prayerFromFirestore;
  export let bold: boolean;
  export let id: string;

  let cssClass = "prayer";
  if (bold) {
    cssClass = "prayer-bold";
  }

  const p = new prayer(data);
  p.id = id;
  const qe: Readable<any> = getContext("qe");
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}" target="_new">
      <Icon name="pencil" />
    </a>
    <i class="bi-pencil-square" on:click={$qe(p)} />
  </div>{/if}
<div class={cssClass}>{@html p.body}</div>
{#if p.author}<div class="prayer-credit">{p.author}</div>{/if}
<Media mediaUrl={p.media} />
