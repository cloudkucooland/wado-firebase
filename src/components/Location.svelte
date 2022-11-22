<script>
  // type="ts"
  import { collection, query, where, limit, orderBy } from "firebase/firestore";
  import { Spinner } from "sveltestrap";
  import { db, getDocCacheFirst, getDocsCacheFirst } from "../firebase";
  import { showEdit, showAlt } from "../model/preferences";
  import Alternatives from "./Alternatives.svelte";

  import Heartwords from "./prayerClasses/Heartwords.svelte";
  import Hymn from "./prayerClasses/Hymn.svelte";
  import Lection from "./prayerClasses/Lection.svelte";
  import Prayer from "./prayerClasses/Prayer.svelte";
  import Psalm from "./prayerClasses/Psalm.svelte";
  import Antiphon from "./prayerClasses/Antiphon.svelte";

  export let name;
  export let proper;
  export let max = 1;
  export let maxAlt = 0;
  export let bold = false;

  export const lookup = new Map([
    ["heartwords", Heartwords],
    ["other", Prayer],
    ["hymn", Hymn],
    ["lection", Lection],
    ["prayer", Prayer],
    ["psalm", Psalm],
    ["antiphon", Antiphon],
  ]);

  if (typeof max !== "number") max = +max;
  if (typeof maxAlt !== "number") maxAlt = +maxAlt;
  const realMax = maxAlt > max ? maxAlt : max;

  const order = "Weight";

  // this needs to be refactored
  async function loaddata() {
    const m = new Map();

    // try with caldate
    let q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Calendar Date", "==", proper.caldate),
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
      where("Season", "==", proper.season),
      where("Proper", "==", proper.proper),
      where("Weekday", "==", proper.weekday),
      where("Year", "==", proper.year),
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
      where("Season", "==", proper.season),
      where("Proper", "==", proper.proper),
      where("Weekday", "==", proper.weekday),
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
      where("Season", "==", proper.season),
      where("Proper", "==", proper.proper),
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
      where("Season", "==", proper.season),
      where("Proper", "==", -1),
      where("Weekday", "==", proper.weekday),
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
      where("Season", "==", proper.season),
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

{#await loaddata()}
  <Spinner color="primary" />
{:then data}
  {#if $showEdit}<div class="edit">
      <a href="#/editlocation/{name}">Edit {name}</a>
    </div>{/if}
  {#if maxAlt > 0 && $showAlt && data.size > 1}
    <Alternatives {data} />
  {:else}
    {#each [...data] as [k, d]}
      <svelte:component this={lookup.get(d.Class)} data={d} id={k} {bold} />
    {/each}
  {/if}
{:catch error}
  toasts.error(error.messages);
  <div>{name}: {error.message}</div>
{/await}
