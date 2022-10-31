<script>
  import Location from "./Location.svelte";

  export let proper;
  // export let bold;
  // export let showall;
</script>

<div class="rubric">
  At the hour when Jesus was placed on the cross, we pray.
</div>
<div class="silence">Silence</div>
<div class="rubric">Be still, aware of God's presence within and around.</div>

<h3>Opening Sentences</h3>
<Location name="DIURNAL-OPENING" {proper} max="1" />

<h3>Prayer</h3>
<Location name="GENERAL-WITHYOU" {proper} max="1" />
<Location name="SEXT-PRAYER" {proper} max="1" />

<h3>Psalter</h3>
<div class="rubric">(commonly sung to psalm tone three or said in unison)</div>
<Location name="SEXT-PSALTER" {proper} max="1" />
<Location name="GENERAL-GLORIA" {proper} max="1" />

<h3>The Little Chapter</h3>
<Location name="SEXT-CHAPTER" {proper} max="1" />
<div class="silence">a brief time of silent prayer</div>

<h3>The Lord's Prayer</h3>
<Location name="GENERAL-LORDS" {proper} max="1" />

<h3>Concluding Prayer</h3>
<Location name="SEXT-CONCLUDING" {proper} max="1" />
<Location name="SEXT-DISMISSAL" {proper} max="1" />
