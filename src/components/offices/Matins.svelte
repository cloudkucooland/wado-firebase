<script>
  import Location from "../Location.svelte";
  import Silence from "../Silence.svelte";
  import Rubric from "../Rubric.svelte";

  export let proper;
</script>

<Rubric>Get around to filling this in</Rubric>
<Silence />
<Rubric>Fill me in; quit sleeping</Rubric>

<h3>Opening Sentences</h3>
<Location name="DIURNAL-OPENING" {proper} />

<h3>Prayer</h3>
<Location name="GENERAL-WITHYOU" {proper} />
<Location name="MATINS-PRAYER" {proper} max="5" />

<h3>Psalter</h3>
<Rubric>(commonly sung to psalm tone three or said in unison)</Rubric>
<Location name="MATINS-PSALTER" {proper} />
<Location name="GENERAL-GLORIA" {proper} />

<h3>The Lord's Prayer</h3>
<Location bold="true" name="GENERAL-LORDS" {proper} />

<h3>Concluding Prayer</h3>
<Location name="GENERAL-DISMISSAL" {proper} />
