<script>
  import prayer from "../model/prayer";

  export let data;
  export let bold = false;

  const p = new prayer(data);
  // console.debug(p);
</script>

<div class="prayer">{@html p.body}</div>
<div class="credit">{p.credit}</div>

<style>
  div.prayer {
    font-family: Georgia, serif;
    line-height: 1.5em;
    margin-bottom: 1em;
    padding-left: 1em;
    text-indent: -1em;
  }
</style>
