<script lang="ts">
  import Location from "../Location.svelte";
  import Silence from "../Silence.svelte";
  import Rubric from "../Rubric.svelte";
  import Lection from "../Lection.svelte";
  import PsalmLection from "../PsalmLection.svelte";
</script>

<h3>Opening</h3>
<h4>Entrance of the Light</h4>
<Location name="VESPERS-LIGHT" maxAlt={3} />

<h4>Hymn of Light (The Phos Hilaron)</h4>
<Location name="PHOS-HILARON" maxAlt={3} />

<h4>+ Thanksgiving for Light</h4>
<Rubric>(Always included in Festive Vespers or Evensong)</Rubric>
<Location name="GENERAL-WITHYOU" />
<Location name="VESPER-COLLECT1" maxAlt={3} />
<Rubric>The community is seated.</Rubric>

<h4>Evening Prayer Canticle</h4>
<Rubric>
  (may be accompanied by the lighting of incense; always included in Festive
  Vespers or Evensong)
</Rubric>
<Location name="VESPER-CANTICLE" />

<h4>Prayer of awareness</h4>
<Location name="VESPER-CONFESSION" maxAlt={3} />
<Silence>silent recollection and examination of conscience</Silence>

<h4>Words of Assurance:</h4>
<Location name="VESPER-PARDON" />

<h3>Psalter</h3>
<PsalmLection office="VESPERS" />
<Location name="VESPER-GLORIA" />
<Silence />

<h3>Word</h3>
<h4>Scripture</h4>
<Lection office="VESPERS" />
<Location name="GENERAL-RESPONSE-SCRIPTURE" />

<h4>Silence for Reflection</h4>

<h4>Canticle of Mary (The Magnificat; Luke 1:39-56)</h4>
<Location name="MAGNIFICAT" />

<Rubric>(unison)</Rubric>

<Location name="VESPER-GLORIA" />
<h4>A Reading for Meditation and Reflection</h4>
<Location name="VESPER-COMMEMORATION" />

<h3>Prayers</h3>

<h4>Silent Prayer</h4>
<Silence
  >Pray for the life of the Church and the world and the concerns of the heart.</Silence
>

<h4>Prayer of Thanksgiving</h4>
<Location name="VESPER-SUPPLICATION" maxAlt={3} />
<h4>Evening Collects</h4>
<Rubric>One and usually more of the following collects.</Rubric>
<Location name="VESPER-COLLECT2" max={10} />

<h4>Prayers of Special Intention</h4>
<Rubric>Proper collects for holy days and major feasts</Rubric>
<Location name="VESPER-COMMEMORATION" subunit="eveningcollect" maxAlt={5} />

<h5>Intercession for the Order of Saint Luke</h5>
<Location name="OSL" />

<h4>The Lord’s Prayer</h4>
<Location name="GENERAL-LORDS" bold={true} /><br />
<h4>Concluding Collect</h4>
<Location name="VESPER-COLLECT3" maxAlt={3} />

<h4>Hymn</h4>
<Location name="VESPER-HYMN" maxAlt={3} />

<h3>Going Forth</h3>
<Location name="VESPER-BENEDICTION" maxAlt={3} />
<Location name="VESPER-DISMISSAL" />

<style>
  h4 {
    font-style: italic;
  }
</style>
