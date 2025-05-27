<script lang="ts">
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import antiphon from "../../model/antiphon";
  import type { prayerFromFirestore } from "../../model/types";
  // import { Icon } from "sveltestrap";
  import { push } from "svelte-spa-router";
  import type { Readable } from "svelte/store";
  import { getContext } from "svelte";

  export let data: prayerFromFirestore;
  export let id: string;
  const qe: Readable<any> = getContext("qe");

  const ant = new antiphon(data);
  ant.id = id;
</script>

{#if $showEdit}<div class="edit">
    <button
      on:click={() => {
        push("#/edit/" + id);
      }}
    >
      <Icon name="pencil" />
    </button>
    <button on:click={$qe(ant)}>
      <Icon name="pencil-square" />
    </button>
  </div>{/if}
<h6>Antiphon</h6>
<div class="antiphon">{@html ant.body}</div>
{#if ant.author}
  <div class="antiphon-credit">{ant.author}</div>
{/if}
<Media mediaUrl={ant.media} />
