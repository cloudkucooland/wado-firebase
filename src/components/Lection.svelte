<script>
  import lection from "../model/lection";

  export let data;
  export let bold;
  export let showall;

  const l = new lection(data);
</script>

<div class="lection">{@html l.body}</div>
