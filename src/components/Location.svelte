<script lang="ts">
  import { collection, query, where, limit, orderBy } from "firebase/firestore";
  import { db, getDocCacheFirst, getDocsCacheFirst } from "../firebase";
  import { showEdit, showAlt } from "../model/preferences";
  import { getContext } from "svelte";
  import Alternatives from "./Alternatives.svelte";
  import { link } from "svelte-spa-router";
  import type { Readable } from "svelte/store";
  import type proper from "../../types/model/proper";
  import { Spinner } from "sveltestrap";

  import Heartwords from "./prayerClasses/Heartwords.svelte";
  import Hymn from "./prayerClasses/Hymn.svelte";
  import Prayer from "./prayerClasses/Prayer.svelte";
  import Psalm from "./prayerClasses/Psalm.svelte";
  import Antiphon from "./prayerClasses/Antiphon.svelte";

  let proper: Readable<proper> = getContext("forProper");
  export let name: string;
  export let max: number = 1;
  export let maxAlt: number = 0;
  export let bold: boolean = false;

  export const lookup = new Map([
    ["heartwords", Heartwords],
    ["other", Prayer],
    ["hymn", Hymn],
    ["prayer", Prayer],
    ["psalm", Psalm],
    ["antiphon", Antiphon],
  ]);

  if (typeof max !== "number") max = +max;
  if (typeof maxAlt !== "number") maxAlt = +maxAlt;
  const realMax = maxAlt > max ? maxAlt : max;

  const order = "Weight";

  // this needs to be refactored
  async function loaddata(p: proper): Promise<Map<string, any>> {
    const m: Map<string, any> = new Map();

    // try with caldate
    let q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Calendar Date", "==", p.caldate),
      orderBy(order),
      limit(realMax)
    );

    let res = await getDocsCacheFirst(q);
    for (const a of res.docs) {
      const doc = await getDocCacheFirst(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= realMax) {
      return m;
    }

    // try with all the details
    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Season", "==", p.season),
      where("Proper", "==", p.proper),
      where("Weekday", "==", p.weekday),
      where("Year", "==", p.year),
      orderBy(order),
      limit(realMax - m.size)
    );

    res = await getDocsCacheFirst(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDocCacheFirst(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= realMax) {
      return m;
    }

    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Season", "==", p.season),
      where("Proper", "==", p.proper),
      where("Weekday", "==", p.weekday),
      where("Year", "==", "Any"),
      orderBy(order),
      limit(realMax - m.size)
    );

    res = await getDocsCacheFirst(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDocCacheFirst(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= realMax) {
      return m;
    }

    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Season", "==", p.season),
      where("Proper", "==", p.proper),
      where("Weekday", "==", -1),
      where("Year", "==", "Any"),
      orderBy(order),
      limit(realMax - m.size)
    );

    res = await getDocsCacheFirst(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDocCacheFirst(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= realMax) {
      return m;
    }

    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Season", "==", p.season),
      where("Proper", "==", -1),
      where("Weekday", "==", p.weekday),
      where("Year", "==", "Any"),
      orderBy(order),
      limit(realMax - m.size)
    );

    res = await getDocsCacheFirst(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDocCacheFirst(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= realMax) {
      return m;
    }

    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Season", "==", p.season),
      where("Proper", "==", -1),
      where("Weekday", "==", -1),
      where("Year", "==", "Any"),
      orderBy(order),
      limit(realMax - m.size)
    );

    res = await getDocsCacheFirst(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDocCacheFirst(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= realMax) {
      return m;
    }

    // just the location
    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Season", "==", "Any"),
      where("Proper", "==", -1),
      where("Weekday", "==", -1),
      where("Year", "==", "Any"),
      orderBy(order),
      limit(realMax - m.size)
    );

    res = await getDocsCacheFirst(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDocCacheFirst(a.data().Reference);
      m.set(doc.id, doc.data());
    }

    if (m.size == 0) console.debug("no results found for", name);

    return m;
  }
</script>

{#await loaddata($proper)}
  <Spinner color="primary" />
{:then data}
  {#if $showEdit}
    <div class="edit">
      <a href="/editlocation/{name}" use:link>Edit {name}</a>
    </div>
  {/if}
  {#if maxAlt > 0 && $showAlt && data.size > 1}
    <Alternatives {data} />
  {:else}
    {#each [...data] as [k, d]}
      <svelte:component this={lookup.get(d.Class)} data={d} id={k} {bold} />
    {/each}
  {/if}
{/await}
