<script>
  import hymn from "../model/hymn";

  export let data;
  const h = new hymn(data);
  console.debug(h);
</script>

<div>{@html h.Body}</div>
