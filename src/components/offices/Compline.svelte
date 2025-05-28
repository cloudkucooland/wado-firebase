<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
	import PsalmLection from '../PsalmLection.svelte';
</script>

<Silence />
<h3>Call to Prayer</h3>
<Location name="COMPLINE-OPENING" />

<h4>Night Hymn</h4>
<Location name="COMPLINE-OPENING-HYMN" />

<h4>Confession and Assurance</h4>
<Location name="COMPILNE-CONFESSION" /><!-- known typo -->
<Silence>a time of silence</Silence>
<Location name="FORGIVEN" />

<h4>Gloria and Psalter</h4>
<Location name="COMPLINE-PSALTER-PREFIX" />
<Location name="COMPLINE-PSALTER" max={3} />
<Location name="GENERAL-GLORIA" />
<Silence />

<h3>The Little Chapter</h3>
<Location name="COMPLINE-CHAPTER" />
<Location name="GENERAL-RESPONSE-SCRIPTURE" />
<Silence>Silence for Reflection</Silence>

<h3>Prayers</h3>
<Location name="GENERAL-WITHYOU" />

<h4>The Kyrie</h4>
<Location name="KYRIE" />
<Silence>Silent Prayer</Silence>

<h4>Night Prayers</h4>
<Rubric>(selected from among the following)</Rubric>
<Location name="COMPLINE-PRAYER" max={10} />

<h3>Concluding Prayer</h3>
<Location name="COMPLINE-CONCLUDING" />

<h3>Hymn</h3>
<Location name="COMPLINE-HYMN" />

<h3>Commendation</h3>
<Location name="COMMENDATION" />

<h3>Canticle of Simeon <i>nunc dimittas</i></h3>
<Location name="SIMEON" />
<Location name="GENERAL-GLORIA" />
<Location name="COMPLINE-DISMISSAL" />
<Rubric>
	Members of the community continue in prayer,<br />and then depart in silence one by one.
</Rubric>
