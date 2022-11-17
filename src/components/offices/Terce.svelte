<script>
  import Location from "./Location.svelte";
  import Silence from "./Silence.svelte";
  import Rubric from "./Rubric.svelte";

  export let proper;
</script>

<Rubric>
  At the hour when the Holy Spirit came upon the Church at Pentecost we pray.
</Rubric>
<Silence />
<Rubric>Be still, aware of God’s presence within and around.</Rubric>

<h3>Opening Sentences</h3>
<Location name="DIURNAL-OPENING" {proper} />

<h3>Prayer</h3>
<Location name="GENERAL-WITHYOU" {proper} />
<Location name="TERCE-PRAYER" {proper} max="5" />

<h3>Psalter</h3>
<Rubric>(commonly sung to psalm tone three or said in unison)</Rubric>
<Location name="TERCE-PSALTER" {proper} />
<Location name="GENERAL-GLORIA" {proper} />

<h3>The Little Chapter</h3>
<Location name="TERCE-CHAPTER" {proper} />
<Silence>a brief time of silent prayer</Silence>

<h3>The Lord's Prayer</h3>
<Location bold="true" name="GENERAL-LORDS" {proper} />

<h3>Concluding Prayer</h3>
<Location name="TERCE-CONCLUDING" {proper} />
<Location name="GENERAL-DISMISSAL" {proper} />
