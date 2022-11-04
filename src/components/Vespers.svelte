<script>
  import Location from "./Location.svelte";
  export let proper;
</script>
<center><h3>Opening</h3></center>
<h4>Entrance of the Light</h4>
<Location name="VESPERS-LIGHT" {proper} />

<h4>Hymn of Light (The Phos Hilaron)</h4>
<Location name="PHOS-HILARON" {proper} />

<h4>+ Thanksgiving for Light</h4>
<div class="rubric">(Always included in Festive Vespers or Evensong)</div>
<Location name="GENERAL-WITHYOU" {proper} />
<Location name="VESPER-COLLECT1" {proper} />
<div class="rubric">The community is seated.</div>

<h4>Evening Prayer Canticle</h4>
<div class="rubric">
  (may be accompanied by the lighting of incense; always included in Festive
  Vespers or Evensong)
</div>

<h4>Prayer of awareness</h4>
<Location name="VESPER-CONFESSION" {proper} />
<div class="rubric">silent recollection and examination of conscience</div>

<h4>Words of Assurance:</h4>
<Location name="VESPER-PARDON" {proper} />

<center><h3>Psalter</h3></center>
<Location name="VESPER-ANTIPHON" {proper} />
<Location name="VESPER-PSALM" {proper} />
<Location name="VESPER-GLORIA" {proper} />
<Location name="VESPER-ANTIPHON" {proper} />
<div class="silence">silence</div>

<center><h3>Word</h3></center>
<h4>Scripture</h4>
<Location name="VESPER-LECTIONARY" {proper} />
<Location name="GENERAL-RESPONSE-SCRIPTURE" {proper} />
<Location name="VESPER-HEARWORD" {proper} /><br />

<h4>Silence for Reflection</h4>

<h4>Canticle of Mary (The Magnificat; Luke 1:39-56)</h4>
<Location name="MAGNIFICAT" {proper} />

<div class="rubric">(unison)</div>

<Location name="VESPER-GLORIA" {proper} />
<h4>A Reading for Meditation and Reflection</h4>

<center><h3>Prayers</h3></center>

<h4>Silent Prayer</h4>
<div class="rubric">
  Pray for the life of the Church and the world and the concerns of the heart.
</div>
<br />

<h4>Prayer of Thanksgiving</h4>
<Location name="VESPER-SUPPLICATION" {proper} />
<h4>Evening Collects</h4>
<div class="rubric">One and usually more of the following collects.</div>
<Location name="VESPER-COLLECT2" {proper} max="10" />

<h4>Prayers of Special Intention</h4>
<h5>Collect of Commemoration</h5>
<div class="rubric">Proper collects for holy days and major feasts</div>
<Location name="VESPER-COMMEMORATION" {proper} />

<h5>Intercession for the Order of Saint Luke</h5>
<Location name="OSL" {proper} />

<h4>The Lord’s Prayer</h4>
<Location name="GENERAL-LORDS" {proper} /><br />
<h4>Concluding Collect</h4>
<Location name="VESPER-COLLECT3" {proper} />

<h4>Hymn</h4>
<Location name="VESPER-HYMN" {proper} />

<h4>Commendation and Canticle of Simeon</h4>
<Location name="SIMEON" {proper} /><br />

<center><h3>Going Forth</h3></center>
<Location name="VESPER-BENEDICTION" {proper} />
<Location name="VESPER-DISMISSAL" {proper} />

<style>
  h4 {
    font-style: italic;
  }
</style>
