<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
	import Heading from '../Heading.svelte';
	import Subheading from '../Subheading.svelte';
</script>

<h2>Vigil</h2>
<Rubric
	>On Saturday evenings, a resurrection vigil replaces vespers and compline, reminding us that the
	first day of every week is a “little Easter.” These vigils are times of watching and waiting,
	trusting the resurrection light that breaks forth in the mystery of darkness. We take time to
	sense the music of the spheres—”the song the morning stars began”—and join with all creation, the
	heavenly host, and the church through the ages in singing the praise of God. The service begins
	and ends in silence.</Rubric
>

<Heading>Opening</Heading>
<Heading>Entrance of the Light</Heading>
<Location name="VIGIL-OPENING" />

<Heading>Opening Sentences</Heading>
<Location name="VIGIL-CANTICLE" />

<Heading>Prayer</Heading>
<Location name="GENERAL-WITHYOU" />

<Location name="VIGIL-COLLECT" />

<Location name="VIGIL-ASSURANCE" />

<Location name="VIGIL-BLESSING" />

<Location name="VIGIL-TEDEUM" />

<Subheading>Prayers</Subheading>
<Rubric>Prayers of Supplicaion and Intercession [is this going to be populated: scb?]</Rubric>
<Location name="GENERAL-WITHYOU" />

<Location name="VIGIL-SUPPLICATION" />

<Heading>The Lord's Prayer</Heading>
<Location name="VIGIL-LORDS" max={2} />

<Location name="VIGIL-COMMENDATION" />

<Location name="SIMEON" />

<Heading>Concluding Prayer</Heading>
<Location name="VIGIL-DISMISSAL" max={3} />

<Rubric
	>No music follows; members of the community remain in prayer and then depart in silence, one by
	one.</Rubric
>
