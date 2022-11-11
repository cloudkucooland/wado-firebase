<script>
  import { showMedia, showEdit } from "../model/preferences";
  import prayer from "../model/prayer";

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
{#if typeof p.author !== "undefined"}
  <div class="credit">{p.author}</div>
{/if}
{#if $showMedia && p.media}<audio controls><source src={p.media} /></audio>{/if}

<style>
  div.prayer {
    font-family: Georgia, serif;
    line-height: 1.5em;
    margin-bottom: 1em;
    padding-left: 1em;
    text-indent: -1em;
  }
  div.prayer-bold {
    font-family: Georgia, serif;
    font-weight: bold;
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
