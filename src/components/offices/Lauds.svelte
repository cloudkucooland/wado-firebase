<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
	import Lection from '../Lection.svelte';
	import PsalmLection from '../PsalmLection.svelte';
	import Heading from '../Heading.svelte';
	import Subheading from '../Subheading.svelte';
</script>

<Heading>Opening</Heading>
<Rubric>Call to Praise and Prayer and Remembrance of Baptism</Rubric>
<Location name="LAUDS-OPENING" maxAlt={5} />
<Location name="LAUDS-REMEMBRANCEBAPTISM" />

<Subheading><i>Morning Hymn</i></Subheading>
<Location name="LAUDS-HYMN1" maxAlt={5} />

<Subheading><i>Morning Prayer</i></Subheading>
<Location name="LAUDS-COLLECT1" max={5} maxAlt={5} />

<Heading>Psalter</Heading>
<PsalmLection office="LAUDS" gloria={false} />
<Silence />

<Heading>Word</Heading>
<Subheading><i>Scripture</i></Subheading>
<Lection office="LAUDS" />
<Location name="GENERAL-RESPONSE-SCRIPTURE" />

<Subheading><i>Silence for Reflection</i></Subheading>
<Silence />

<Subheading><i>Canticle of Zechariah</i></Subheading>
<Location name="GENERAL-ZECHARIAH" maxAlt={5} />
<Location name="GENERAL-GLORIA" />

<Subheading><i>Reading for Meditation and Reflection</i></Subheading>

<Heading>Prayers</Heading>
<Rubric>Give thanks and pray for the coming day and the needs of the world.</Rubric>

<Subheading><i>Prayers of Thanksgiving and Supplication</i></Subheading>
<Location name="LAUDS-SUPPLICATION" maxAlt={5} /><br />
<Rubric>Morning Collects (one or more of the following)</Rubric>
<Location name="VESPER-COMMEMORATION" subunit="morningcollect" maxAlt={5} />
<Location name="LAUDS-COLLECT2" max={3} maxAlt={5} />
<Location name="LAUDS-SEASONAL" max={3} maxAlt={5} />

<Subheading><i>Prayers for the Order of Saint Luke</i></Subheading>
<Rubric>One or more of the following</Rubric>
<Location name="OSL" max={3} />

<Subheading><i>The Lord’s Prayer</i></Subheading>
<Location name="GENERAL-LORDS" />

<Subheading><i>Concluding Collect</i></Subheading>
<Location name="LAUDS-COLLECT-FINAL" maxAlt={5} />

<Subheading><i>Hymn</i></Subheading>
<Location name="LAUDS-HYMN2" maxAlt={5} />

<Heading>Going Forth</Heading>
<Location name="LAUDS-BENEDICTION" />
<Location name="LAUDS-DISMISSAL" />
