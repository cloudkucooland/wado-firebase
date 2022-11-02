<script>
  import Location from "./Location.svelte";

  export let proper;
</script>

<h1>Morning Prayer</h1>
<center><h3>Opening</h3></center>
<div class="rubric">Call to Praise and Prayer and Remembrance of Baptism</div>
<Location name="LAUDS-OPENING" {proper} />
<Location name="LAUDS-REMEMBRANCEBAPTISM" {proper} />

<h4><i>Morning Hymn</i></h4>
<Location name="LAUDS-HYMN1" {proper} />

<h4><i>Morning Prayer</i></h4>
<Location showall="on" name="LAUDS-COLLECT1" {proper} />

<center><h3>Psalter</h3></center><br />
<Location name="LAUDS-PSALTER-ANTIPHON" {proper} />
<Location name="LAUDS-PSALM" {proper} />
<Location name="LAUDS-GLORIA" {proper} />
<Location name="LAUDS-PSALTER-ANTIPHON" {proper} /><br />
<div class="silence">silence</div>
<br />

<center><h3>Word</h3></center><br />
<h4><i>Scripture</i></h4>
<Location name="LAUDS-LECTIONARY" {proper} /><br />
<Location name="LAUDS-LECTIONARY2" {proper} /><br />
<Location name="GENERAL-RESPONSE-SCRIPTURE" {proper} />
<Location name="LAUDS-LECTIONARY-HEARWHATSAYING" {proper} />

<h4><i>Silence for Reflection</i></h4>
<div class="silence">silence</div>

<h4><i>Canticle of Zechariah</i></h4>
<Location name="GENERAL-ZECHARIAH" {proper} />
<Location name="GENERAL-GLORIA" {proper} />

<h4><i>Reading for Meditation and Reflection</i></h4>
<br />

<center><h3>Prayers</h3></center>
<br />
<div class="rubric">
  Give thanks and pray for the coming day and the needs of the world.
</div>
<br />

<h4><i>Prayers of Thanksgiving and Supplication</i></h4>
<Location name="LAUDS-SUPPLICATION" {proper} /><br />
<div class="rubric">Morning Collects (one or more of the following)</div>
<Location showall="on" name="LAUDS-COLLECT2" {proper} max="3" />
<Location showall="on" name="LAUDS-SEASONAL" {proper} max="3" />

<h4><i>Collect for the Order of Saint Luke</i></h4>
<Location name="OSL" {proper} />

<h4><i>Intercessions for the Order of Saint Luke</i></h4>
<prayer>OSL Intercession</prayer>

<h4><i>The Lord’s Prayer</i></h4>
<Location name="GENERAL-LORDS" {proper} />

<h4><i>Concluding Collect</i></h4>
<Location name="LAUDS-COLLECT-FINAL" {proper} />

<h4><i>Hymn</i></h4>
<Location name="LAUDS-HYMN2" {proper} />

<center><h3>Going Forth</h3></center>
<Location name="LAUDS-BENEDICTION" {proper} />
<Location name="LAUDS-DISMISSAL" {proper} />
