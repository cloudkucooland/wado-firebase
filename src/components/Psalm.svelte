<script>
  import { showMedia, debugOn, showEdit } from "../model/preferences";
  import psalm from "../model/psalm";

  export let data;
  export let bold;
  export let id;

  const p = new psalm(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {p.name}]</a>
  </div>{/if}
<div class="psalm" {bold}>{@html p.body}</div>
{#if typeof p.author !== "undefined"}
  <div class="credit">{p.author}</div>
{/if}
{#if $showMedia && p.media}
  <div class="media">{p.media}</div>
{/if}

<style>
  div.psalm {
    font-family: Georgia, serif;
    line-height: 1.5em;
    margin-bottom: 2em;
  }
</style>
