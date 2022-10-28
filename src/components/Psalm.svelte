<script>
  import psalm from "../model/psalm";

  export let data;
  const p = new psalm(data);
  console.debug(p);
</script>

<div>{@html p.body}</div>
