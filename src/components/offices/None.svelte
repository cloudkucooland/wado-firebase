<script lang="ts">
  import Location from "../Location.svelte";
  import Silence from "../Silence.svelte";
  import Rubric from "../Rubric.svelte";
  import PsalmLection from "../PsalmLection.svelte";
</script>

<Rubric>At the hour when Jesus died on the cross, we pray.</Rubric>
<Silence />
<Rubric>Be still, aware of God's presence within and around.</Rubric>

<h3>Opening Sentences</h3>
<Location name="DIURNAL-OPENING" />

<h3>Prayer</h3>
<Location name="GENERAL-WITHYOU" />
<Location name="NONE-PRAYER" />

<h3>Psalter</h3>
<Location name="NONE-PSALTER" maxAlt={3} />
<Location name="GENERAL-GLORIA" />

<h3>The Little Chapter</h3>
<Location name="NONE-CHAPTER" />
<Silence>A brief time of silent prayer</Silence>

<h3>The Lord's Prayer</h3>
<Location bold={true} name="GENERAL-LORDS" />

<h3>Concluding Prayer</h3>
<Location name="NONE-CONCLUDING" />
<Location name="NONE-DISMISSAL" />
