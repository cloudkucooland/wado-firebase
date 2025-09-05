<script lang="ts">
	import Location from '../Location.svelte';
	import Silence from '../Silence.svelte';
	import Rubric from '../Rubric.svelte';
	import Lection from '../Lection.svelte';
	import PsalmLection from '../PsalmLection.svelte';
	import Heading from '../Heading.svelte';
	import Subheading from '../Subheading.svelte';
	import { Heading as FBHeading } from 'flowbite-svelte';
</script>

<Heading>Opening</Heading>
<Subheading>Entrance of the Light</Subheading>
<Location name="VESPERS-LIGHT" maxAlt={3} />

<Subheading>Hymn of Light (The Phos Hilaron)</Subheading>
<Location name="PHOS-HILARON" maxAlt={3} />

<Subheading>+ Thanksgiving for Light</Subheading>
<Rubric>(Always included in Festive Vespers or Evensong)</Rubric>
<Location name="GENERAL-WITHYOU" />
<Location name="VESPER-COLLECT1" maxAlt={3} />
<Rubric>The community is seated.</Rubric>

<Subheading>Evening Prayer Canticle</Subheading>
<Rubric>
	(may be accompanied by the lighting of incense; always included in Festive Vespers or Evensong)
</Rubric>
<Location name="VESPER-CANTICLE" />

<Subheading>Prayer of awareness</Subheading>
<Location name="VESPER-CONFESSION" maxAlt={3} />
<Silence>silent recollection and examination of conscience</Silence>

<Subheading>Words of Assurance:</Subheading>
<Location name="VESPER-PARDON" />

<Heading>Psalter</Heading>
<PsalmLection office="VESPERS" gloria={true} />
<Silence />

<Heading>Word</Heading>
<Subheading>Scripture</Subheading>
<Lection office="VESPERS" />
<Location name="GENERAL-RESPONSE-SCRIPTURE" />

<Subheading>Silence for Reflection</Subheading>

<Subheading>Canticle of Mary (The Magnificat; Luke 1:39-56)</Subheading>
<Location name="MAGNIFICAT" />

<Rubric>(unison)</Rubric>

<Location name="VESPER-GLORIA" />
<Subheading>A Reading for Meditation and Reflection</Subheading>
<Location name="VESPER-COMMEMORATION" />

<Heading>Prayers</Heading>

<Subheading>Silent Prayer</Subheading>
<Silence>Pray for the life of the Church and the world and the concerns of the heart.</Silence>

<Subheading>Prayer of Thanksgiving</Subheading>
<Location name="VESPER-SUPPLICATION" maxAlt={3} />
<Subheading>Evening Collects</Subheading>
<Rubric>One and usually more of the following collects.</Rubric>
<Location name="VESPER-COLLECT2" max={10} />

<Subheading>Prayers of Special Intention</Subheading>
<Rubric>Proper collects for holy days and major feasts</Rubric>
<Location name="VESPER-COMMEMORATION" subunit="eveningcollect" maxAlt={5} />

<FBHeading tag="h5">Prayers for the Order of Saint Luke</FBHeading>
<Rubric>One or more of the following</Rubric>
<Location name="OSL" max={3} />

<Subheading>The Lord’s Prayer</Subheading>
<Location name="GENERAL-LORDS" bold={true} /><br />
<Subheading>Concluding Collect</Subheading>
<Location name="VESPER-COLLECT3" maxAlt={3} />

<Subheading>Hymn</Subheading>
<Location name="VESPER-HYMN" maxAlt={3} />

<Heading>Going Forth</Heading>
<Location name="VESPER-BENEDICTION" maxAlt={3} />
<Location name="VESPER-DISMISSAL" />
