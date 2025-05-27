<script lang="ts">
  // import { TabContent, TabPane } from "sveltestrap";

  import Hymn from "./prayerClasses/Hymn.svelte";
  import Prayer from "./prayerClasses/Prayer.svelte";
  import Psalm from "./prayerClasses/Psalm.svelte";
  import Antiphon from "./prayerClasses/Antiphon.svelte";
  import type { prayerFromFirestore } from "../model/types";

  export const lookup = new Map([
    ["other", Prayer],
    ["hymn", Hymn],
    ["prayer", Prayer],
    ["psalm", Psalm],
    ["antiphon", Antiphon],
  ]);

  export let data: Map<string, prayerFromFirestore>;

  // this needs to be redone properly
  let isA: number = 0;
  function isActive() {
    isA = isA + 1;
    if (isA == 1) return true;
    return false;
  }

  function shortname(name: string) {
    if (name.length < 30) return name;

    const words = name.split(" ");
    let shortName = "";
    let i = 0;
    while (shortName.length < 25) {
      if (i > 0) shortName += " ";
      shortName += words[i];
      i = i + 1;
    }
    return shortName;
  }
</script>

<TabContent>
  {#each [...data] as [id, d]}
    <TabPane tabId={id} tab={shortname(d.Name)} active={isActive()}>
      <svelte:component this={lookup.get(d.Class)} data={d} {id} />
    </TabPane>
  {/each}
</TabContent>
