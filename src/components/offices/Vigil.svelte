<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
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

<h3>Opening</h3>
<h3>Entrance of the Light</h3>
<Location name="VIGIL-OPENING" />

<h3>Opening Sentences</h3>
<Location name="VIGIL-CANTICLE" />

<h3>Prayer</h3>
<Location name="GENERAL-WITHYOU" />

<Location name="VIGIL-COLLECT" />

<Location name="VIGIL-ASSURANCE" />

<Location name="VIGIL-BLESSING" />

<Location name="VIGIL-TEDEUM" />

<h4>Prayers</h4>
<Rubric>Prayers of Supplicaion and Intercession [is this going to be populated: scb?]</Rubric>
<Location name="GENERAL-WITHYOU" />

<Location name="VIGIL-SUPPLICATION" />

<h3>The Lord's Prayer</h3>
<Location name="VIGIL-LORDS" max={2} />

<Location name="VIGIL-COMMENDATION" />

<Location name="SIMEON" />

<h3>Concluding Prayer</h3>
<Location name="VIGIL-DISMISSAL" max={3} />

<Rubric
	>No music follows; members of the community remain in prayer and then depart in silence, one by
	one.</Rubric
>
