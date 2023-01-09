<script lang="ts">
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import psalm from "../../model/psalm";
  import type { prayerFromFirestore } from "../../model/types";
  import type { Readable } from "svelte/store";
  import { getContext } from "svelte";
  import { Icon } from "sveltestrap";

  export let data: prayerFromFirestore;
  export let id: string;

  const p = new psalm(data);
  p.id = id;
  const qe: Readable<any> = getContext("qe");
</script>

<h5>
  {p.name}
  {#if $showEdit}<span class="edit">
      <a href="#/edit/{id}" target="_new">
        <Icon name="pencil" />
      </a>
      <i class="bi-pencil-square" on:click={$qe(p)} />
    </span>{/if}
</h5>
{#if p.rubric}
  <div class="psalm-rubric">{p.rubric}</div>
{/if}
<div class="psalm">{@html p.body}</div>
{#if p.author}
  <div class="psalm-credit">{p.author}</div>
{/if}
<Media mediaUrl={p.media} />
