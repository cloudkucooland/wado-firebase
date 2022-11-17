<script>
  import Location from "./Location.svelte";
  import Silence from "./Silence.svelte";
  import Rubric from "./Rubric.svelte";

  export let proper;
</script>

<h3>Opening</h3>
<Rubric>Call to Praise and Prayer and Remembrance of Baptism</Rubric>
<Location name="LAUDS-OPENING" {proper} maxAlt={5} />
<Location name="LAUDS-REMEMBRANCEBAPTISM" {proper} />

<h4><i>Morning Hymn</i></h4>
<Location name="LAUDS-HYMN1" {proper} maxAlt={5} />

<h4><i>Morning Prayer</i></h4>
<Location name="LAUDS-COLLECT1" {proper} max="5" maxAlt={5} />

<h3>Psalter</h3>
<Location name="LAUDS-PSALTER-ANTIPHON" {proper} />
<Location name="LAUDS-PSALM" {proper} />
<Location name="LAUDS-GLORIA" {proper} />
<Location name="LAUDS-PSALTER-ANTIPHON" {proper} /><br />
<Silence />

<h3>Word</h3>
<h4><i>Scripture</i></h4>
<Location name="LAUDS-LECTIONARY" {proper} /><br />
<Location name="LAUDS-LECTIONARY2" {proper} /><br />
<Location name="GENERAL-RESPONSE-SCRIPTURE" {proper} />
<Location name="LAUDS-LECTIONARY-HEARWHATSAYING" {proper} />

<h4><i>Silence for Reflection</i></h4>
<Silence />

<h4><i>Canticle of Zechariah</i></h4>
<Location name="GENERAL-ZECHARIAH" {proper} maxAlt={5} />
<Location name="GENERAL-GLORIA" {proper} />

<h4><i>Reading for Meditation and Reflection</i></h4>

<h3>Prayers</h3>
<Rubric>
  Give thanks and pray for the coming day and the needs of the world.
</Rubric>

<h4><i>Prayers of Thanksgiving and Supplication</i></h4>
<Location name="LAUDS-SUPPLICATION" {proper} maxAlt={5} /><br />
<Rubric>Morning Collects (one or more of the following)</Rubric>
<Location name="LAUDS-COLLECT2" {proper} max="3" maxAlt={5} />
<Location name="LAUDS-SEASONAL" {proper} max="3" maxAlt={5} />

<h4><i>Collect for the Order of Saint Luke</i></h4>
<Location name="OSL" {proper} />

<h4><i>The Lord’s Prayer</i></h4>
<Location name="GENERAL-LORDS" {proper} />

<h4><i>Concluding Collect</i></h4>
<Location name="LAUDS-COLLECT-FINAL" {proper} maxAlt={5} />

<h4><i>Hymn</i></h4>
<Location name="LAUDS-HYMN2" {proper} maxAlt={5} />

<h3>Going Forth</h3>
<Location name="LAUDS-BENEDICTION" {proper} />
<Location name="LAUDS-DISMISSAL" {proper} />
