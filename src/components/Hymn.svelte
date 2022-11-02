<script>
  import { showMedia, showEdit } from "../model/preferences";
  import hymn from "../model/hymn";

  export let data;
  export let bold;
  export let showall;
  export let id;

  const h = new hymn(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {h.name}]</a>
  </div>{/if}
{#if showall}&nbsp;{/if}
<div class="hymn" {bold}>{@html h.body}</div>
<div>
  {#if typeof h.hymntune !== "undefined"}
    <span class="hymntune">{h.hymntune}</span>
  {/if}
  {#if typeof h.hymnmeter !== "undefined"}
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
  span.hymntune {
    font-family: Georgia, serif;
    font-variant: small-caps;
  }
  span.hymnmeter {
    font-family: Georgia, serif;
    font-variant: all-caps;
  }
</style>
