<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
	import Heading from '../Heading.svelte';
</script>

<Rubric>At the hour when Jesus died on the cross, we pray.</Rubric>
<Silence />
<Rubric>Be still, aware of God's presence within and around.</Rubric>

<Heading>Opening Sentences</Heading>
<Location name="DIURNAL-OPENING" />

<Heading>Prayer</Heading>
<Location name="GENERAL-WITHYOU" />
<Location name="NONE-PRAYER" />

<Heading>Psalter</Heading>
<Location name="NONE-PSALTER" maxAlt={3} />
<Location name="GENERAL-GLORIA" />

<Heading>The Little Chapter</Heading>
<Location name="NONE-CHAPTER" />
<Silence>A brief time of silent prayer</Silence>

<Heading>The Lord's Prayer</Heading>
<Location bold={true} name="GENERAL-LORDS" />

<Heading>Concluding Prayer</Heading>
<Location name="NONE-CONCLUDING" />
<Location name="NONE-DISMISSAL" />
