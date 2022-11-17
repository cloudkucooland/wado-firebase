<script>
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import lection from "../../model/lection";

  export let data;
  export let bold;
  export let id;

  const l = new lection(data);
  let cssclass = "lection";
  if (bold) cssclass = "lection-bold";
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {l.name}]</a>
  </div>{/if}
<h5>{l.name}</h5>
<div class={cssclass}>{@html l.body}</div>
<Media mediaUrl={l.media} />

<style>
  div.lection {
    font-family: Georgia, serif;
    line-height: 2.5em;
  }
  div.lection-bold {
    font-family: Georgia, serif;
    line-height: 2.5em;
    font-weight: bold;
  }
</style>
