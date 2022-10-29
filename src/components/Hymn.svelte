<script>
  import hymn from "../model/hymn";

  export let data;
  const h = new hymn(data);
  console.debug(h);
</script>

<div class="hymn">{@html h.body}</div>
<div>
  <span class="hymntune">{h.hymntune}</span>
  <span class="hymnmeter">{h.hymnmeter}</span>
</div>

<style>
  span.hymntune {
    font-family: Georgia, serif;
    font-variant: small-caps;
  }
  span.hymnmeter {
    font-family: Georgia, serif;
    font-variant: all-caps;
  }
</style>
