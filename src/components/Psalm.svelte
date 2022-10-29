<script>
  import psalm from "../model/psalm";

  export let data;
  export let bold = false;

  const p = new psalm(data);
</script>

<div class="psalm">{@html p.body}</div>
