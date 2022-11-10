<script>
  import { showMedia, showEdit } from "../model/preferences";
  import hymn from "../model/hymn";

  export let data;
  export let id;

  const h = new hymn(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {h.name}]</a>
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
{#if $showMedia && h.media}<div class="media">{h.media}</div>{/if}

<style>
  div.hymn {
    font-family: Georgia, serif;
    line-height: 1.5em;
    margin-bottom: 2em;
  }
  div.hymndata {
    text-align: right;
  }
  span.hymntune {
    font-family: Georgia, serif;
    font-variant: small-caps;
  }
  span.hymnmeter {
    font-family: Georgia, serif;
    font-variant: all-caps;
  }
</style>
