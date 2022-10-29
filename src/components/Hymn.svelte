<script>
  import hymn from "../model/hymn";

  export let data;
  export let bold;
  export let showall;

  const h = new hymn(data);
</script>

<div class="hymn">{@html h.body}</div>
<div>
  {#if typeof h.hymntune !== "undefined"}
    <span class="hymntune">{h.hymntune}</span>
  {/if}
  {#if typeof h.hymnmeter !== "undefined"}
    <span class="hymnmeter">{h.hymnmeter}</span>
  {/if}
</div>

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
