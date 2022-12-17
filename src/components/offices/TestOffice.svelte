<script lang="ts">
  import Location from "../Location.svelte";
  import Silence from "../Silence.svelte";
  import Rubric from "../Rubric.svelte";
</script>

<Rubric>This is a rubric</Rubric>
<Silence />
<Silence>Silence with content</Silence>

<h3>Lectionary w/ alternatives</h3>
<Location name="LAUDS-LECTIONARY" maxAlt={5} />

<h3>KYRIE w/ alternates</h3>
<Location name="KYRIE" maxAlt={5} />

<h3>The Lord's Prayer w/ alternatives</h3>
<Location name="GENERAL-LORDS" maxAlt={5} />

<h3>Antiphon test</h3>
<Location name="LAUDS-PSALTER-ANTIPHON" />
<Location name="LAUDS-PSALM" />
<Location name="LAUDS-PSALTER-ANTIPHON" />
