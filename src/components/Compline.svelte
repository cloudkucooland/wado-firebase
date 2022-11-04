<script>
  import Location from "./Location.svelte";

  export let proper;
  console.debug("Compline with Proper: ", proper);
</script>

<div class="silence">Silence</div>
<h3>Call to Prayer</h3>
<Location name="COMPLINE-OPENING" {proper} />

<h4>Night Hymn</h4>
<Location name="COMPLINE-OPENING-HYMN" {proper} />

<h4>Confession and Assurance</h4>
<Location name="COMPILNE-CONFESSION" {proper} />
<div class="silence">a time of silence</div>
<Location name="FORGIVEN" {proper} />

<h4>Gloria and Psalter</h4>
<Location name="COMPLINE-PSALTER-PREFIX" {proper} />
<Location name="COMPLINE-PSALTER" {proper} max="5" />
<Location name="GENERAL-GLORIA" {proper} />
<div class="silence">Silence</div>

<h3>The Little Chapter</h3>
<Location name="COMPLINE-CHAPTER" {proper} />
<Location name="GENERAL-RESPONSE-SCRIPTURE" {proper} />
<div class="silence">Silence for Reflection</div>

<h3>Prayers</h3>
<Location name="GENERAL-WITHYOU" {proper} />

<h4>The Kyrie</h4>
<Location name="KYRIE" {proper} />
<div class="silence">Silent Prayer</div>

<h4>Night Prayers</h4>
<div class="rubric">(selected from among the following)</div>
<Location name="COMPLINE-PRAYER" max="10" {proper} />

<h3>Concluding Prayer</h3>
<Location name="COMPLINE-CONCLUDING" {proper} />
<Location name="COMPLINE-HYMN" {proper} />

<h3>Commendation</h3>
<Location name="COMMENDATION" {proper} />

<h3>Canticle of Simeon <i>nunc dimittas</i></h3>
<Location name="SIMEON" {proper} />
<Location name="GENERAL-GLORIA" {proper} />
<Location name="GENERAL-DISMISSAL" {proper} />
<div class="rubric">
  Members of the community continue in prayer,<br />and then depart in silence
  one by one.
</div>
