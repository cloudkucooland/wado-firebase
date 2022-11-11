<script>
  import { showMedia, showEdit } from "../model/preferences";
  import antiphon from "../model/antiphon";

  export let data;
  export let id;

  const ant = new antiphon(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {ant.name}]</a>
  </div>{/if}
<div class="antiphon">{@html ant.body}</div>
{#if $showMedia && ant.media}<div class="media">{ant.media}</div>{/if}
{#if ant.author}
  <div class="credit">{ant.author}</div>
{/if}

<style>
  div.antiphon {
    font-family: Georgia, serif;
    line-height: 1.5em;
    margin-bottom: 1em;
    padding-left: 1em;
    text-indent: -1em;
  }
  div.credit {
    font-family: Georgia, serif;
    line-height: 1.5em;
    margin-bottom: 1em;
    padding-left: 1em;
    text-indent: -1em;
  }
</style>
