<script lang="ts">
  import Location from "../Location.svelte";
  import Silence from "../Silence.svelte";
  import Rubric from "../Rubric.svelte";
  import Lection from "../Lection.svelte";
  import PsalmLection from "../PsalmLection.svelte";
</script>

<h3>Opening</h3>
<Rubric>Call to Praise and Prayer and Remembrance of Baptism</Rubric>
<Location name="LAUDS-OPENING" maxAlt={5} />
<Location name="LAUDS-REMEMBRANCEBAPTISM" />

<h4><i>Morning Hymn</i></h4>
<Location name="LAUDS-HYMN1" maxAlt={5} />

<h4><i>Morning Prayer</i></h4>
<Location name="LAUDS-COLLECT1" max={5} maxAlt={5} />

<h3>Psalter</h3>
<PsalmLection office="LAUDS" />
<Silence />

<h3>Word</h3>
<h4><i>Scripture</i></h4>
<Lection office="LAUDS" />
<Location name="GENERAL-RESPONSE-SCRIPTURE" />

<h4><i>Silence for Reflection</i></h4>
<Silence />

<h4><i>Canticle of Zechariah</i></h4>
<Location name="GENERAL-ZECHARIAH" maxAlt={5} />
<Location name="GENERAL-GLORIA" />

<h4><i>Reading for Meditation and Reflection</i></h4>

<h3>Prayers</h3>
<Rubric>
  Give thanks and pray for the coming day and the needs of the world.
</Rubric>

<h4><i>Prayers of Thanksgiving and Supplication</i></h4>
<Location name="LAUDS-SUPPLICATION" maxAlt={5} /><br />
<Rubric>Morning Collects (one or more of the following)</Rubric>
<Location name="VESPER-COMMEMORATION" subunit="morningcollect" maxAlt={5} />
<Location name="LAUDS-COLLECT2" max={3} maxAlt={5} />
<Location name="LAUDS-SEASONAL" max={3} maxAlt={5} />

<h4><i>Prayers for the Order of Saint Luke</i></h4>
<Rubric>One or more of the following</Rubric>
<Location name="OSL" max={3} />

<h4><i>The Lord’s Prayer</i></h4>
<Location name="GENERAL-LORDS" />

<h4><i>Concluding Collect</i></h4>
<Location name="LAUDS-COLLECT-FINAL" maxAlt={5} />

<h4><i>Hymn</i></h4>
<Location name="LAUDS-HYMN2" maxAlt={5} />

<h3>Going Forth</h3>
<Location name="LAUDS-BENEDICTION" />
<Location name="LAUDS-DISMISSAL" />
