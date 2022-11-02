<script>
  import { showMedia, showEdit } from "../model/preferences";
  import heartword from "../model/heartword";

  export let data;
  export let bold;
  export let showall;
  export let id;

  const hw = new heartword(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {hw.name}]</a>
  </div>{/if}
{#if bold}&nbsp{/if}
{#if showall}&nbsp{/if}
<div class="heartword">{@html hw.body}</div>
{#if $showMedia && hw.media}<div class="media">{hw.media}</div>{/if}
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
