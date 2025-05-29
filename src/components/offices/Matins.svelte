<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
	import Heading from '../Heading.svelte';
	import Subheading from '../Subheading.svelte';
</script>

<Rubric>Get around to filling this in</Rubric>
<Silence />
<Rubric>Fill me in; quit sleeping</Rubric>

<Heading>Opening Sentences</Heading>
<Location name="DIURNAL-OPENING" />

<Heading>Prayer</Heading>
<Location name="GENERAL-WITHYOU" />
<Location name="MATINS-PRAYER" max={5} />

<Heading>Psalter</Heading>
<Rubric>(commonly sung to psalm tone three or said in unison)</Rubric>
<Location name="MATINS-PSALTER" />
<Location name="GENERAL-GLORIA" />

<Heading>The Lord's Prayer</Heading>
<Location bold={true} name="GENERAL-LORDS" />

<Heading>Concluding Prayer</Heading>
<Location name="GENERAL-DISMISSAL" />
