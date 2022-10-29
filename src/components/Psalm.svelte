<script>
  import psalm from "../model/psalm";

  export let data;
  export let bold;
  export let showall;

  const p = new psalm(data);
</script>

<div class="psalm">{@html p.body}</div>
{#if typeof p.author !== "undefined"}
  <div class="credit">{p.author}</div>
{/if}

<style>
  div.psalm {
    font-family: Georgia, serif;
    line-height: 1.5em;
    margin-bottom: 2em;
  }
</style>
