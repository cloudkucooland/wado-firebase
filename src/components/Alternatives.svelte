<script>
  import { TabContent, TabPane } from "sveltestrap";

  import Heartwords from "./prayerClasses/Heartwords.svelte";
  import Hymn from "./prayerClasses/Hymn.svelte";
  import Lection from "./prayerClasses/Lection.svelte";
  import Prayer from "./prayerClasses/Prayer.svelte";
  import Psalm from "./prayerClasses/Psalm.svelte";
  import Antiphon from "./prayerClasses/Antiphon.svelte";

  export const lookup = new Map([
    ["heartwords", Heartwords],
    ["other", Prayer],
    ["hymn", Hymn],
    ["lection", Lection],
    ["prayer", Prayer],
    ["psalm", Psalm],
    ["antiphon", Antiphon],
  ]);

  export let data;

  let isA = 0;
  function isActive() {
    isA = isA + 1;
    if (isA == 1) return "active";
    return "";
  }
</script>

<TabContent>
  {#each [...data] as [k, d]}
    <TabPane tabId={k} tab={d.Name} active={isActive(k)}>
      <svelte:component this={lookup.get(d.Class)} data={d} id={k} />
    </TabPane>
  {/each}
</TabContent>
