<script>
  import { showMedia, debugOn, showEdit } from "../model/preferences";
  import lection from "../model/lection";

  export let data;
  export let bold;
  export let showall;

  const l = new lection(data);
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{l.name}">[Edit: {l.name}]</a>
  </div>{/if}
{#if bold}&nbsp;{/if}
{#if showall}&nbsp;{/if}
<div class="lection">{@html l.body}</div>
{#if $showMedia && l.media}<div class="media">{l.media}</div>{/if}
