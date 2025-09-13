<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
	import Heading from '../Heading.svelte';
</script>

<Rubric>At the hour when Jesus was placed on the cross, we pray.</Rubric>
<Silence />
<Rubric>Be still, aware of God's presence within and around.</Rubric>

<Heading>Opening Sentences</Heading>
<Location name="DIURNAL-OPENING" />

<Heading>Prayer</Heading>
<Location name="GENERAL-WITHYOU" />
<br />

<Location name="SEXT-PRAYER" />

<Heading>Psalter</Heading>
<Rubric>(commonly sung to psalm tone three or said in unison)</Rubric>
<Location name="SEXT-PSALTER" gloria={true} />

<Heading>The Little Chapter</Heading>
<Location name="SEXT-CHAPTER" />
<Silence>a brief time of silent prayer</Silence>

<Heading>The Lord's Prayer</Heading>
<Location name="GENERAL-LORDS" />

<Heading>Concluding Prayer</Heading>
<Location name="SEXT-CONCLUDING" />
<Location name="SEXT-DISMISSAL" />
