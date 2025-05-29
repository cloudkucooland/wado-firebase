<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
	import PsalmLection from '../PsalmLection.svelte';
	import Heading from '../Heading.svelte';
	import Subheading from '../Subheading.svelte';
</script>

<Silence />
<Heading>Call to Prayer</Heading>
<Location name="COMPLINE-OPENING" />

<Subheading>Night Hymn</Subheading>
<Location name="COMPLINE-OPENING-HYMN" />

<Subheading>Confession and Assurance</Subheading>
<Location name="COMPILNE-CONFESSION" /><!-- known typo -->
<Silence>a time of silence</Silence>
<Location name="FORGIVEN" />

<Subheading>Gloria and Psalter</Subheading>
<Location name="COMPLINE-PSALTER-PREFIX" />
<Location name="COMPLINE-PSALTER" max={3} />
<Location name="GENERAL-GLORIA" />
<Silence />

<Heading>The Little Chapter</Heading>
<Location name="COMPLINE-CHAPTER" />
<Location name="GENERAL-RESPONSE-SCRIPTURE" />
<Silence>Silence for Reflection</Silence>

<Heading>Prayers</Heading>
<Location name="GENERAL-WITHYOU" />

<Subheading>The Kyrie</Subheading>
<Location name="KYRIE" />
<Silence>Silent Prayer</Silence>

<Subheading>Night Prayers</Subheading>
<Rubric>(selected from among the following)</Rubric>
<Location name="COMPLINE-PRAYER" max={10} />

<Heading>Concluding Prayer</Heading>
<Location name="COMPLINE-CONCLUDING" />

<Heading>Hymn</Heading>
<Location name="COMPLINE-HYMN" />

<Heading>Commendation</Heading>
<Location name="COMMENDATION" />

<Heading>Canticle of Simeon <i>nunc dimittas</i></Heading>
<Location name="SIMEON" />
<Location name="GENERAL-GLORIA" />
<Location name="COMPLINE-DISMISSAL" />
<Rubric>
	Members of the community continue in prayer,<br />and then depart in silence one by one.
</Rubric>
