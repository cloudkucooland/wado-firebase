<script lang="ts">
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import psalm from "../../model/psalm";
  import type { prayerFromFirestore } from "../../model/types";
  import type { Readable } from "svelte/store";
  import { getContext } from "svelte";
  // import { Icon } from "sveltestrap";
  import { push } from "svelte-spa-router";
  import { toasts } from "svelte-toasts";
  import Antiphon from "./Antiphon.svelte";
  import { getDoc } from "firebase/firestore";

  export let data: prayerFromFirestore;
  export let id: string;

  const p = new psalm(data);
  p.id = id;
  const qe: Readable<any> = getContext("qe");
  let antiphon: prayerFromFirestore;
  let antID: string;

  if (p.antiphon) {
    try {
      getDoc(p.antiphon).then((snap) => {
        antID = snap.id;
        antiphon = snap.data() as prayerFromFirestore;
      });
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }
</script>

<h5>
  {p.name}
  {#if $showEdit}<span class="edit">
      <button
        on:click={() => {
          push("#/edit/" + p.id);
        }}
      >
        <Icon name="pencil" />
      </button>
      <button on:click={$qe(p)}>
        <Icon name="pencil-square" />
      </button>
    </span>{/if}
</h5>
{#if p.rubric}
  <div class="psalm-rubric">{p.rubric}</div>
{/if}
{#if antiphon}
  <Antiphon data={antiphon} id={antID} />
{/if}
<div class="psalm">{@html p.body}</div>
{#if p.author}
  <div class="psalm-credit">{p.author}</div>
{/if}
<Media mediaUrl={p.media} />
{#if antiphon}
  <Antiphon data={antiphon} id={antID} />
{/if}
