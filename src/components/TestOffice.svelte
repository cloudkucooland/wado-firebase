<script>
  import Location from "./Location.svelte";
  import Silence from "./Silence.svelte";
  import Rubric from "./Rubric.svelte";

  export let proper;
</script>

<Rubric>This is a rubric</Rubric>
<Silence />
<Silence>Silence with content</Silence>

<h3>UNSET</h3>
<Location name="UNSET" {proper} />

<h3>UNSET max=50</h3>
<Location name="UNSET" max="50" {proper} />

<h3>The Lord's Prayer (bold)</h3>
<Location bold="true" name="GENERAL-LORDS" {proper} />
