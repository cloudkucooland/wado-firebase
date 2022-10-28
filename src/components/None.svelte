<script>
  // header, rubric, silence -- need to be components
  // import { Container, Col, Row, Card, CardHeader, CardBody } from "sveltestrap";
  import Location from "./Location.svelte";

  export let proper;
  console.debug("None with Proper: ", proper);
</script>

<div class="rubric">At the hour when Jesus died on the cross, we pray.</div>
<div class="silence">Silence</div>
<div class="rubric">Be still, aware of God's presence within and around.</div>

<h3>Opening Sentences</h3>
<Location name="DIURNAL-OPENING" {proper} />

<h3>Prayer</h3>
<Location name="GENERAL-WITHYOU" {proper} />
<Location name="NONE-PRAYER" {proper} />

<h3>Psalter</h3>
<div class="rubric">(commonly sung to psalm tone three or said in unison)</div>
<Location name="NONE-PSALTER" {proper} />
<Location name="GENERAL-GLORIA" {proper} />

<h3>The Little Chapter</h3>
<Location name="NONE-CHAPTER" {proper} />
<div class="silence">A brief time of silent prayer</div>

<h3>The Lord's Prayer</h3>
<Location name="GENERAL-LORDS" {proper} />

<h3>Concluding Prayer</h3>
<Location name="NONE-CONCLUDING" {proper} />
<Location name="NONE-DISMISSAL" {proper} />
