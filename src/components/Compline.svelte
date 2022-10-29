<script>
  import Location from "./Location.svelte";

  export let proper;
  console.debug("Compline with Proper: ", proper);
</script>

<div class="silence">Silence</div>
<h3>Call to Prayer</h3>
<Location name="COMPLINE-OPENING" {proper} max="1" />

<h4>Night Hymn</h4>
<Location name="COMPLINE-OPENING-HYMN" {proper} max="1" />

<h4>Confession and Assurance</h4>
<Location name="COMPILNE-CONFESSION" {proper} max="1" />
<div class="silence">a time of silence</div>
<Location name="FORGIVEN" {proper} max="1" />

<h4>Gloria and Psalter</h4>
<Location name="COMPLINE-PSALTER-PREFIX" {proper} max="1" />
<Location showall="true" name="COMPLINE-PSALTER" {proper} max="5" />
<Location name="GENERAL-GLORIA" {proper} max="1" />
<div class="silence">Silence</div>

<h3>The Little Chapter</h3>
<Location name="COMPLINE-CHAPTER" {proper} max="1" />
<Location name="GENERAL-RESPONSE-SCRIPTURE" {proper} max="1" />
<div class="silence">Silence for Reflection</div>

<h3>Prayers</h3>
<Location name="GENERAL-WITHYOU" {proper} max="1" />

<h4>The Kyrie</h4>
<Location name="KYRIE" {proper} max="1" />
<div class="silence">Silent Prayer</div>

<h4>Night Prayers</h4>
<div class="rubric">(selected from among the following)</div>
<Location showall="on" name="COMPLINE-PRAYER" max="10" {proper} />

<h3>Concluding Prayer</h3>
<Location name="COMPLINE-CONCLUDING" {proper} max="1" />
<Location name="COMPLINE-HYMN" {proper} max="1" />

<h3>Commendation</h3>
<Location name="COMMENDATION" {proper} max="1" />

<h3>Canticle of Simeon <i>nunc dimittas</i></h3>
<Location name="SIMEON" {proper} max="1" />
<Location name="GENERAL-GLORIA" {proper} max="1" />
<Location name="GENERAL-DISMISSAL" {proper} max="1" />
<div class="rubric">
  Members of the community continue in prayer,<br />and then depart in silence
  one by one.
</div>
