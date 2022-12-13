<script>
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import heartword from "../../model/heartword";

  export let data;
  export let id;

  const hw = new heartword(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {hw.name}]</a>
  </div>{/if}
<div class="heartword">Hear what the spirit is saying:</div>
<div class="heartword">{@html hw.body}</div>
{#if typeof hw.author !== "undefined"}
  <div class="heartword-credit">{hw.author}</div>
{/if}
<Media mediaUrl={hw.media} />
