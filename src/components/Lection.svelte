<script>
  import lection from "../model/lection";

  export let data;
  export let bold = flase;
  const l = new lection(data);
</script>

<div class="lection">{@html l.body}</div>
