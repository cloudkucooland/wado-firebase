<script>
  import { showEdit } from "../model/preferences";
  import Media from "./Media.svelte";
  import psalm from "../model/psalm";

  export let data;
  export let id;

  const p = new psalm(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {p.name}]</a>
  </div>{/if}
<h5>{p.name}</h5>
{#if p.rubric}
  <div class="psalm-rubric">{p.rubric}</div>
{/if}
<div class="psalm">{@html p.body}</div>
{#if p.author}
  <div class="credit">{p.author}</div>
{/if}
<Media mediaUrl={p.media} />

<style>
  div.psalm {
    font-family: Georgia, serif;
    line-height: 1.5em;
    margin-bottom: 1.5em;
  }
  div.psalm-rubric {
    font-family: Georgia, serif;
    font-style: italic;
    text-align: center;
  }
  div.credit {
    font-family: Georgia, serif;
    font-style: italic;
    text-align: right;
    font-variant: small-caps;
  }
</style>
