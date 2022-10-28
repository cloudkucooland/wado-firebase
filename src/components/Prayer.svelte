<script>
  import prayer from "../model/prayer";

  export let data;
  const p = new prayer(data);
  // console.debug(p);
</script>

<div>{@html p.body}</div>
