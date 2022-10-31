<script>
  import heartword from "../model/heartword";

  export let data;
  export let bold;
  export let showall;

  const hw = new heartword(data);
</script>

<div class="heartword">{@html hw.body}</div>
{#if typeof hw.author !== "undefined"}
  <div class="credit">{hw.author}</div>
{/if}

<style>
  div.heartword {
    font-family: Georgia, serif;
    line-height: 1.5em;
    margin-bottom: 1em;
    padding-left: 1em;
    text-indent: -1em;
  }

  div.credit {
    font-family: Georgia, serif;
    font-style: italic;
    text-align: right;
    font-variant: small-caps;
  }
</style>
