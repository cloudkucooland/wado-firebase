<script>
  import Location from "../Location.svelte";
  import Silence from "../Silence.svelte";
  import Rubric from "../Rubric.svelte";
</script>

<Rubric>
  At the hour when the Holy Spirit came upon the Church at Pentecost we pray.
</Rubric>
<Silence />
<Rubric>Be still, aware of God’s presence within and around.</Rubric>

<h3>Opening Sentences</h3>
<Location name="DIURNAL-OPENING" />

<h3>Prayer</h3>
<Location name="GENERAL-WITHYOU" />
<Location name="TERCE-PRAYER" max="5" />

<h3>Psalter</h3>
<Rubric>(commonly sung to psalm tone three or said in unison)</Rubric>
<Location name="TERCE-PSALTER" />
<Location name="GENERAL-GLORIA" />

<h3>The Little Chapter</h3>
<Location name="TERCE-CHAPTER" />
<Silence>a brief time of silent prayer</Silence>

<h3>The Lord's Prayer</h3>
<Location bold="true" name="GENERAL-LORDS" />

<h3>Concluding Prayer</h3>
<Location name="TERCE-CONCLUDING" />
<Location name="GENERAL-DISMISSAL" />
