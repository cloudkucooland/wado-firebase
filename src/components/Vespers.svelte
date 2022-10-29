<script>
  import Location from "./Location.svelte";

  export let proper;
  console.debug("Terce with Proper: ", proper);
</script>

<center><h3>Opening</h3></center>
<h4>Entrance of the Light</h4>
<Location name="VESPERS-LIGHT" {proper} max="1" />

<h4>Hymn of Light (The Phos Hilaron)</h4>
<Location name="PHOS-HILARON" {proper} max="1" />

<h4>+ Thanksgiving for Light</h4>
<div class="rubric">(Always included in Festive Vespers or Evensong)</div>
<Location name="GENERAL-WITHYOU" {proper} max="1" />
<Location name="VESPER-COLLECT1" {proper} max="1" />
<div class="rubric">The community is seated.</div>

<h4>Evening Prayer Canticle</h4>
<div class="rubric">
  (may be accompanied by the lighting of incense; always included in Festive
  Vespers or Evensong)
</div>

<h4>Prayer of awareness</h4>
<Location name="VESPER-CONFESSION" {proper} max="1" />
<div class="rubric">silent recollection and examination of conscience</div>

<h4>Words of Assurance:</h4>
<Location name="VESPER-PARDON" {proper} max="1" />

<center><h3>Psalter</h3></center>
<Location name="VESPER-ANTIPHON" {proper} max="1" />
<Location name="VESPER-PSALM" {proper} max="1" />
<Location name="VESPER-GLORIA" {proper} max="1" />
<Location name="VESPER-ANTIPHON" {proper} max="1" />
<div class="silence">silence</div>

<center><h3>Word</h3></center>
<h4>Scripture</h4>
<Location name="VESPER-LECTIONARY" {proper} max="1" />
<Location name="GENERAL-RESPONSE-SCRIPTURE" {proper} max="1" />
<Location name="VESPER-HEARWORD" {proper} max="1" /><br />

<h4>Silence for Reflection</h4>

<h4>Canticle of Mary (The Magnificat; Luke 1:39-56)</h4>
<Location name="MAGNIFICAT" {proper} max="1" />

<div class="rubric">(unison)</div>

<Location name="VESPER-GLORIA" {proper} max="1" />
<h4>A Reading for Meditation and Reflection</h4>

<center><h3>Prayers</h3></center>

<h4>Silent Prayer</h4>
<div class="rubric">
  Pray for the life of the Church and the world and the concerns of the heart.
</div>
<br />

<h4>Prayer of Thanksgiving</h4>
<Location name="VESPER-SUPPLICATION" {proper} max="1" />
<h4>Evening Collects</h4>
<div class="rubric">One and usually more of the following collects.</div>
<Location showall="true" name="VESPER-COLLECT2" {proper} max="10" />

<h4>Prayers of Special Intention</h4>
<h5>Collect of Commemoration</h5>
<div class="rubric">Proper collects for holy days and major feasts</div>
<Location name="VESPER-COMMEMORATION" {proper} max="1" />

<h5>Intercession for the Order of Saint Luke</h5>
<Location name="OSL" {proper} max="1" />

<h4>The Lord’s Prayer</h4>
<Location name="GENERAL-LORDS" {proper} max="1" /><br />
<h4>Concluding Collect</h4>
<Location name="VESPER-COLLECT3" {proper} max="1" />

<h4>Hymn</h4>
<Location name="VESPER-HYMN" {proper} max="1" />

<h4>Commendation and Canticle of Simeon</h4>
<Location name="SIMEON" {proper} max="1" /><br />

<center><h3>Going Forth</h3></center>
<Location name="VESPER-BENEDICTION" {proper} max="1" />
<Location name="VESPER-DISMISSAL" {proper} max="1" />

<style>
  h4 {
    font-style: italic;
  }
</style>
