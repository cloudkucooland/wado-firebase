<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
	import Heading from '../Heading.svelte';
</script>

<Rubric>At the hour when the Holy Spirit came upon the Church at Pentecost we pray.</Rubric>
<Silence />
<Rubric>Be still, aware of God’s presence within and around.</Rubric>

<Heading>Opening Sentences</Heading>
<Location name="DIURNAL-OPENING" />

<Heading>Prayer</Heading>
<Location name="GENERAL-WITHYOU" />
<br />

<Location name="TERCE-PRAYER" max={5} />

<Heading>Psalter</Heading>
<Rubric>(commonly sung to psalm tone three or said in unison)</Rubric>
<Location name="TERCE-PSALTER" gloria={true} />

<Heading>The Little Chapter</Heading>
<Location name="TERCE-CHAPTER" />
<Silence>a brief time of silent prayer</Silence>

<Heading>The Lord's Prayer</Heading>
<Location bold={true} name="GENERAL-LORDS" />

<Heading>Concluding Prayer</Heading>
<Location name="TERCE-CONCLUDING" />
<Location name="GENERAL-DISMISSAL" />
