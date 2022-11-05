<script>
  import { showMedia, showEdit } from "../model/preferences";
  import lection from "../model/lection";

  export let data;
  export let bold;
  export let id;

  const l = new lection(data);

  async function getBody() {
    if (l.body.length < 30) {
      return l.fromBibleGateway();
    } else {
      return l.body;
    }
  }
</script>

{#if $showEdit}<div class="edit">
    <a href="#/edit/{id}">[Edit: {l.name}]</a>
  </div>{/if}
{#if bold}&nbsp;{/if}
<div class="lection">{@html getBody()}</div>
{#if $showMedia && l.media}<div class="media">{l.media}</div>{/if}
