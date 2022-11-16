<script>
  // type="ts"
  import {
    collection,
    query,
    where,
    getDoc,
    getDocs,
    limit,
    orderBy,
  } from "firebase/firestore";
  import { db } from "../firebase";

  import Heartwords from "./Heartwords.svelte";
  import Hymn from "./Hymn.svelte";
  import Lection from "./Lection.svelte";
  import Prayer from "./Prayer.svelte";
  import Psalm from "./Psalm.svelte";
  import Antiphon from "./Antiphon.svelte";
  import { showEdit } from "../model/preferences";

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
  const realMax = (maxAlt > max) ? maxAlt : max;

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

    let res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >=realMax) {
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

    res = await getDocs(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDoc(a.data().Reference);
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

    res = await getDocs(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDoc(a.data().Reference);
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

    res = await getDocs(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDoc(a.data().Reference);
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

    res = await getDocs(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDoc(a.data().Reference);
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

    res = await getDocs(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDoc(a.data().Reference);
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

    res = await getDocs(q);
    for (const a of res.docs) {
      if (a.data().CalendarDate != "Any") continue;
      const doc = await getDoc(a.data().Reference);
      m.set(doc.id, doc.data());
    }

    if (m.size == 0) console.debug("no results found for", name);

    return m;
  }
</script>

{#await loaddata()}
  <div>Loading {name}</div>
{:then data}
  {#if $showEdit}<div class="edit">
      <a href="#/editlocation/{name}">Edit {name}</a>
    </div>{/if}
  {#each [...data] as [k, d]}
    <svelte:component this={lookup.get(d.Class)} data={d} id={k} {bold} maxAlt={maxAlt} max={max} />
  {/each}
{:catch error}
  <div>{name}: {error.message}</div>
{/await}
