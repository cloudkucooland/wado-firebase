<script lang="ts">
  import Location from "../Location.svelte";
  import Silence from "../Silence.svelte";
  import Rubric from "../Rubric.svelte";
</script>

<Rubric>At the hour when Jesus was placed on the cross, we pray.</Rubric>
<Silence />
<Rubric>Be still, aware of God's presence within and around.</Rubric>

<h3>Opening Sentences</h3>
<Location name="DIURNAL-OPENING" />

<h3>Prayer</h3>
<Location name="GENERAL-WITHYOU" />
<Location name="SEXT-PRAYER" />

<h3>Psalter</h3>
<Rubric>(commonly sung to psalm tone three or said in unison)</Rubric>
<Location name="SEXT-PSALTER" />
<Location name="GENERAL-GLORIA" />

<h3>The Little Chapter</h3>
<Location name="SEXT-CHAPTER" />
<Silence>a brief time of silent prayer</Silence>

<h3>The Lord's Prayer</h3>
<Location name="GENERAL-LORDS" />

<h3>Concluding Prayer</h3>
<Location name="SEXT-CONCLUDING" />
<Location name="SEXT-DISMISSAL" />
