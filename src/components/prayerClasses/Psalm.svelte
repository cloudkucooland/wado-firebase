<script>
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import psalm from "../../model/psalm";

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
  <div class="psalm-credit">{p.author}</div>
{/if}
<Media mediaUrl={p.media} />
