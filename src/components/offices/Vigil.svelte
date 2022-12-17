<script lang="ts">
  import Location from "../Location.svelte";
  import Silence from "../Silence.svelte";
  import Rubric from "../Rubric.svelte";
</script>

<Rubric>Get around to filling this in</Rubric>
<Silence />
<Rubric>Fill me in; wait for it...</Rubric>

<h3>Opening Sentences</h3>
<Location name="DIURNAL-OPENING" />

<h3>Prayer</h3>
<Location name="GENERAL-WITHYOU" />

<h3>Psalter</h3>
<Location name="GENERAL-GLORIA" />

<h3>The Lord's Prayer</h3>
<Location bold={true} name="GENERAL-LORDS" />

<h3>Concluding Prayer</h3>
<Location name="GENERAL-DISMISSAL" />
