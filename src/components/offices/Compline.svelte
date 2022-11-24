<script>
  import Location from "../Location.svelte";
  import Silence from "../Silence.svelte";
  import Rubric from "../Rubric.svelte";
  import PsalmLection from "../PsalmLection.svelte";

  export let proper;
</script>

<Silence />
<h3>Call to Prayer</h3>
<Location name="COMPLINE-OPENING" {proper} />

<h4>Night Hymn</h4>
<Location name="COMPLINE-OPENING-HYMN" {proper} />

<h4>Confession and Assurance</h4>
<Location name="COMPILNE-CONFESSION" {proper} />
<Silence>a time of silence</Silence>
<Location name="FORGIVEN" {proper} />

<h4>Gloria and Psalter</h4>
<Location name="COMPLINE-PSALTER-PREFIX" {proper} />
<PsalmLection office="COMPLINE" {proper} />
<Location name="GENERAL-GLORIA" {proper} />
<Silence />

<h3>The Little Chapter</h3>
<Location name="COMPLINE-CHAPTER" {proper} />
<Location name="GENERAL-RESPONSE-SCRIPTURE" {proper} />
<Silence>Silence for Reflection</Silence>

<h3>Prayers</h3>
<Location name="GENERAL-WITHYOU" {proper} />

<h4>The Kyrie</h4>
<Location name="KYRIE" {proper} />
<Silence>Silent Prayer</Silence>

<h4>Night Prayers</h4>
<Rubric>(selected from among the following)</Rubric>
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
<Rubric>
  Members of the community continue in prayer,<br />and then depart in silence
  one by one.
</Rubric>
