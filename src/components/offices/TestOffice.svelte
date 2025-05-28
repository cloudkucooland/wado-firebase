<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
	import PsalmLection from '../PsalmLection.svelte';
</script>

<h3>Commemoration test</h3>
<Location name="VESPER-COMMEMORATION" />
<Location name="VESPER-PARDON" />

<!-- <Rubric>This is a rubric</Rubric>
<Silence />
<Silence>Silence with content</Silence> -->

<!-- <h3>Multiples:</h3>
<Location name="LAUDS-COLLECT1" max={5} /> -->

<!-- <h3>KYRIE w/ alternates</h3>
<Location name="KYRIE" maxAlt={5} /> -->

<h3>Antiphon test</h3>
<PsalmLection office="COMPLINE" />
