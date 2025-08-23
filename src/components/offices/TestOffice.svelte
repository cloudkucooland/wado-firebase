<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
	import PsalmLection from '../PsalmLection.svelte';
	import Heading from '../Heading.svelte';
</script>

<Heading>Commemoration test</Heading>
<Location name="VESPER-COMMEMORATION" />
<Location name="VESPER-PARDON" />

<!-- <Rubric>This is a rubric</Rubric>
<Silence />
<Silence>Silence with content</Silence> -->

<!-- <Heading>Multiples:</Heading>
<Location name="LAUDS-COLLECT1" max={5} /> -->

<!-- <Heading>KYRIE w/ alternates</Heading>
<Location name="KYRIE" maxAlt={5} /> -->

<Heading>Antiphon test</Heading>
<PsalmLection office="COMPLINE" />
