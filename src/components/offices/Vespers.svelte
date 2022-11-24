<script>
  import Location from "../Location.svelte";
  import Silence from "../Silence.svelte";
  import Rubric from "../Rubric.svelte";
  import Lection from "../Lection.svelte";
  import PsalmLection from "../PsalmLection.svelte";

  export let proper;
</script>

<h3>Opening</h3>
<h4>Entrance of the Light</h4>
<Location name="VESPERS-LIGHT" {proper} altMax="3" />

<h4>Hymn of Light (The Phos Hilaron)</h4>
<Location name="PHOS-HILARON" {proper} altMax="3" />

<h4>+ Thanksgiving for Light</h4>
<Rubric>(Always included in Festive Vespers or Evensong)</Rubric>
<Location name="GENERAL-WITHYOU" {proper} />
<Location name="VESPER-COLLECT1" {proper} altMax="3" />
<Rubric>The community is seated.</Rubric>

<h4>Evening Prayer Canticle</h4>
<Rubric>
  (may be accompanied by the lighting of incense; always included in Festive
  Vespers or Evensong)
</Rubric>

<h4>Prayer of awareness</h4>
<Location name="VESPER-CONFESSION" {proper} altMax="3" />
<Silence>silent recollection and examination of conscience</Silence>

<h4>Words of Assurance:</h4>
<Location name="VESPER-PARDON" {proper} />

<h3>Psalter</h3>
<PsalmLection {proper} office="VESPERS" />
<Location name="VESPER-GLORIA" {proper} />
<Silence />

<h3>Word</h3>
<h4>Scripture</h4>
<Lection office="VESPERS" {proper} />
<Location name="GENERAL-RESPONSE-SCRIPTURE" {proper} />

<h4>Silence for Reflection</h4>

<h4>Canticle of Mary (The Magnificat; Luke 1:39-56)</h4>
<Location name="MAGNIFICAT" {proper} />

<Rubric>(unison)</Rubric>

<Location name="VESPER-GLORIA" {proper} />
<h4>A Reading for Meditation and Reflection</h4>

<h3>Prayers</h3>

<h4>Silent Prayer</h4>
<Silence
  >Pray for the life of the Church and the world and the concerns of the heart.</Silence
>

<h4>Prayer of Thanksgiving</h4>
<Location name="VESPER-SUPPLICATION" {proper} altMax="3" />
<h4>Evening Collects</h4>
<Rubric>One and usually more of the following collects.</Rubric>
<Location name="VESPER-COLLECT2" {proper} max="10" />

<h4>Prayers of Special Intention</h4>
<h5>Collect of Commemoration</h5>
<Rubric>Proper collects for holy days and major feasts</Rubric>
<Location name="VESPER-COMMEMORATION" {proper} altMax="3" />

<h5>Intercession for the Order of Saint Luke</h5>
<Location name="OSL" {proper} />

<h4>The Lord’s Prayer</h4>
<Location name="GENERAL-LORDS" {proper} /><br />
<h4>Concluding Collect</h4>
<Location name="VESPER-COLLECT3" {proper} altMax="3" />

<h4>Hymn</h4>
<Location name="VESPER-HYMN" {proper} altMax="3" />

<h4>Commendation and Canticle of Simeon</h4>
<Location name="SIMEON" {proper} altMax="3" /><br />

<h3>Going Forth</h3>
<Location name="VESPER-BENEDICTION" {proper} />
<Location name="VESPER-DISMISSAL" {proper} />

<style>
  h4 {
    font-style: italic;
  }
</style>
