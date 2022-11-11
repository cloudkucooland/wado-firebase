<script>
  import { showMedia, showEdit } from "../model/preferences";
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
{#if $showMedia && p.media}
  <div class="media">{p.media}</div>
{/if}

<style>
  div.psalm {
    font-family: Georgia, serif;
    line-height: 1.5em;
    margin-bottom: 2em;
  }
  div.psalm-rubric {
    font-family: Georgia, serif;
    line-height: 1.5em;
    margin-bottom: 2em;
    font-weight: italic;
  }
  div.credit {
    font-family: Georgia, serif;
    font-style: italic;
    text-align: right;
    font-variant: small-caps;
  }
</style>
