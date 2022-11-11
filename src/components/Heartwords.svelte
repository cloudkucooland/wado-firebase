<script>
  import { showMedia, showEdit } from "../model/preferences";
  import heartword from "../model/heartword";

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
  <div class="credit">{hw.author}</div>
{/if}
{#if $showMedia && hw.media}<audio controls><source src={hw.media} /></audio
  >{/if}

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
