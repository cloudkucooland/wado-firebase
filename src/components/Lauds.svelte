<script>
  import Location from "./Location.svelte";

  export let proper;
</script>

<h1>Morning Prayer</h1>
<center><h3>Opening</h3></center>
<div class="rubric">Call to Praise and Prayer and Remembrance of Baptism</div>
<Location name="LAUDS-OPENING" {proper} max="1" />
<Location name="LAUDS-REMEMBRANCEBAPTISM" {proper} max="1" />

<h4><i>Morning Hymn</i></h4>
<Location name="LAUDS-HYMN1" {proper} max="1" />

<h4><i>Morning Prayer</i></h4>
<Location showall="on" name="LAUDS-COLLECT1" {proper} max="1" />

<center><h3>Psalter</h3></center><br />
<Location name="LAUDS-PSALTER-ANTIPHON" {proper} max="1" />
<Location name="LAUDS-PSALM" {proper} max="1" />
<Location name="LAUDS-GLORIA" {proper} max="1" />
<Location name="LAUDS-PSALTER-ANTIPHON" {proper} max="1" /><br />
<div class="silence">silence</div>
<br />

<center><h3>Word</h3></center><br />
<h4><i>Scripture</i></h4>
<Location name="LAUDS-LECTIONARY" {proper} max="1" /><br />
<Location name="LAUDS-LECTIONARY2" {proper} max="1" /><br />
<Location name="GENERAL-RESPONSE-SCRIPTURE" {proper} max="1" />
<Location name="LAUDS-LECTIONARY-HEARWHATSAYING" {proper} max="1" />

<h4><i>Silence for Reflection</i></h4>
<div class="silence">silence</div>

<h4><i>Canticle of Zechariah</i></h4>
<Location name="GENERAL-ZECHARIAH" {proper} max="1" />
<Location name="GENERAL-GLORIA" {proper} max="1" />

<h4><i>Reading for Meditation and Reflection</i></h4>
<br />

<center><h3>Prayers</h3></center>
<br />
<div class="rubric">
  Give thanks and pray for the coming day and the needs of the world.
</div>
<br />

<h4><i>Prayers of Thanksgiving and Supplication</i></h4>
<Location name="LAUDS-SUPPLICATION" {proper} max="1" /><br />
<div class="rubric">Morning Collects (one or more of the following)</div>
<Location showall="on" name="LAUDS-COLLECT2" {proper} max="3" />
<Location showall="on" name="LAUDS-SEASONAL" {proper} max="3" />

<h4><i>Collect for the Order of Saint Luke</i></h4>
<Location name="OSL" {proper} max="1" />

<h4><i>Intercessions for the Order of Saint Luke</i></h4>
<prayer>OSL Intercession</prayer>

<h4><i>The Lord’s Prayer</i></h4>
<Location name="GENERAL-LORDS" {proper} max="1" />

<h4><i>Concluding Collect</i></h4>
<Location name="LAUDS-COLLECT-FINAL" {proper} max="1" />

<h4><i>Hymn</i></h4>
<Location name="LAUDS-HYMN2" {proper} max="1" />

<center><h3>Going Forth</h3></center>
<Location name="LAUDS-BENEDICTION" {proper} max="1" />
<Location name="LAUDS-DISMISSAL" {proper} max="1" />
