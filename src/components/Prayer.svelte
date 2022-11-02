<script>
  import { showMedia, debugOn, showEdit } from "../model/preferences";
  import prayer from "../model/prayer";

  export let data;
  export let bold;
  export let showall;
  export let id;

  const p = new prayer(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {p.name}]</a>
  </div>{/if}
{#if $debugOn && showall} &nbsp; {/if}
<div class="prayer" {bold}>{@html p.body}</div>
{#if $showMedia && p.media}<div class="media">{p.media}</div>{/if}
{#if typeof p.author !== "undefined"}
  <div class="credit">{p.author}</div>
{/if}

<style>
  div.prayer {
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
