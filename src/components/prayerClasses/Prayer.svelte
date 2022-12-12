<script>
  import { showEdit } from "../../model/preferences";
  import Media from "../Media.svelte";
  import prayer from "../../model/prayer";

  export let data;
  export let bold;
  export let id;

  let cssClass = "prayer";
  if (bold) {
    cssClass = "prayer-bold";
  }

  const p = new prayer(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {p.name}]</a>
  </div>{/if}
<div class={cssClass}>{@html p.body}</div>
{#if p.author}<div class="credit">{p.author}</div>{/if}
<Media mediaUrl={p.media} />

<style>
  div.prayer {
    font-family: Georgia, serif;
    line-height: 1.25em;
    margin-bottom: 0.25em;
    padding-left: 1em;
    text-indent: -1em;
  }
  div.prayer-bold {
    font-family: Georgia, serif;
    font-weight: bold;
    line-height: 1.5em;
    margin-bottom: 0.25em;
    padding-left: 1em;
    text-indent: -1em;
  }
  div.credit {
    font-family: Georgia, serif;
    font-style: italic;
    text-align: right;
    _font-variant: small-caps;
    margin-bottom: 0.25em;
    padding-right: 1em;
  }
</style>
