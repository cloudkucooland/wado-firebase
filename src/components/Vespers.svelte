<script>
  import Location from "./Location.svelte";

  export let proper;
  console.debug("Terce with Proper: ", proper);
</script>

<div class="rubric">
  At the hour when the Holy Spirit came upon the Church at Pentecost we pray.
</div>
<div class="silence">Silence</div>
<div class="rubric">Be still, aware of God’s presence within and around.</div>

<h3>Opening Sentences</h3>
<association>DIURNAL-OPENING</association>

<h3>Prayer</h3>
<Location name="GENERAL-WITHYOU" {proper} max="1" />
<Location name="TERCE-PRAYER" {proper} max="5" />

<h3>Psalter</h3>
<div class="rubric">(commonly sung to psalm tone three or said in unison)</div>
<Location name="TERCE-PSALTER" {proper} max="1" />
<Location name="GENERAL-GLORIA" {proper} max="1" />

<h3>The Little Chapter</h3>
<Location name="TERCE-CHAPTER" {proper} max="1" />
<div class="silence">a brief time of silent prayer</div>

<h3>The Lord's Prayer</h3>
<Location bold="true" name="GENERAL-LORDS" max="1" />

<h3>Concluding Prayer</h3>
<Location name="TERCE-CONCLUDING" max="1" />
<Location name="GENERAL-DISMISSAL" max="1" />
