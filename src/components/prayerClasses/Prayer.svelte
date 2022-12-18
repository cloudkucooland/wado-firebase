<script lang="ts">
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import prayer from "../../model/prayer";

  export let data: string;
  export let bold: boolean;
  export let id: string;

  let cssClass = "prayer";
  if (bold) {
    cssClass = "prayer-bold";
  }

  const p = new prayer(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {p.name}]</a>
  </div>{/if}
<div class={cssClass}>{@html p.body}</div>
{#if p.author}<div class="prayer-credit">{p.author}</div>{/if}
<Media mediaUrl={p.media} />
