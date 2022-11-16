<script>
  import Location from "./Location.svelte";
  import Silence from "./Silence.svelte";
  import Rubric from "./Rubric.svelte";

  export let proper;
</script>

<Rubric>This is a rubric</Rubric>
<Silence />
<Silence>Silence with content</Silence>

<h3>Lectionary</h3>
<Location name="LAUDS-LECTIONARY" {proper} />

<h3>KYRIE w/ alternates</h3>
<Location name="KYRIE" {proper} maxAlt="5" />

<h3>The Lord's Prayer (bold)</h3>
<Location bold="true" name="GENERAL-LORDS" {proper} />

<h3>The Lord's Prayer max=5</h3>
<Location name="GENERAL-LORDS" max="5" {proper} />

<h3>Antiphon test</h3>
<Location name="LAUDS-PSALTER-ANTIPHON" {proper} />
<Location name="LAUDS-PSALM" {proper} />
<Location name="LAUDS-PSALTER-ANTIPHON" {proper} />
