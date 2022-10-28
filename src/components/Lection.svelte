<script>
  import lection from "../model/lection";

  export let data;
  const l = new lection(data);
  console.debug(l);
</script>

<div>{@html l.body}</div>
