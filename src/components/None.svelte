<script>
  import Location from "./Location.svelte";

  export let proper;
  console.debug("None with Proper: ", proper);
</script>

<div class="rubric">At the hour when Jesus died on the cross, we pray.</div>
<div class="silence">Silence</div>
<div class="rubric">Be still, aware of God's presence within and around.</div>

<h3>Opening Sentences</h3>
<Location name="DIURNAL-OPENING" {proper} max="1" />

<h3>Prayer</h3>
<Location name="GENERAL-WITHYOU" {proper} max="1" />
<Location name="NONE-PRAYER" {proper} />

<h3>Psalter</h3>
<div class="rubric">(commonly sung to psalm tone three or said in unison)</div>
<Location name="NONE-PSALTER" {proper} max="1" />
<Location name="GENERAL-GLORIA" {proper} max="1" />

<h3>The Little Chapter</h3>
<Location name="NONE-CHAPTER" {proper} max="1" />
<div class="silence">A brief time of silent prayer</div>

<h3>The Lord's Prayer</h3>
<Location name="GENERAL-LORDS" {proper} max="1" />

<h3>Concluding Prayer</h3>
<Location name="NONE-CONCLUDING" {proper} max="1" />
<Location name="NONE-DISMISSAL" {proper} max="1" />
