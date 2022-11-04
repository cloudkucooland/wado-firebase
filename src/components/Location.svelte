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
  import { showEdit } from "../model/preferences";

  export let name;
  export let proper;
  export let max = 1;
  export let order = "Weight";
  export let bold = false;

  if (typeof max !== "number") max = +max;

  // console.debug("Location: ", name, proper);

  export const lookup = new Map([
    ["heartwords", Heartwords],
    ["other", Prayer],
    ["hymn", Hymn],
    ["lection", Lection],
    ["prayer", Prayer],
    ["psalm", Psalm],
  ]);

  async function loaddata() {
    const m = new Map();

    // try with caldate
    let q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Calendar Date", "==", proper.caldate),
      orderBy(order),
      limit(max)
    );

    let res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= max) {
      // console.debug("exact calendar date", m.size);
      return m;
    }

    // console.debug(name, proper.season, proper.proper, proper.weekday, proper.year);

    // try with all the details
    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Season", "==", proper.season),
      where("Proper", "==", proper.proper),
      where("Weekday", "==", proper.weekday),
      where("Year", "==", proper.year),
      orderBy(order),
      limit(max - m.size)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= max) {
      // console.debug("season, proper, weekday, year", m.size);
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
      limit(max - m.size)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= max) {
      // console.debug("season, proper, weekday", m.size);
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
      limit(max - m.size)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= max) {
      // console.debug("season & proper only", m.size);
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
      limit(max - m.size)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= max) {
      // console.debug("season & weekday only", m.size);
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
      limit(max - m.size)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size >= max) {
      // console.debug("season only", m.size, name);
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
      limit(max - m.size)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      m.set(doc.id, doc.data());
    }
    if (m.size == 0) console.debug("location only", m.size, name);

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
    <svelte:component this={lookup.get(d.Class)} data={d} id={k} {bold} />
  {/each}
{:catch error}
  <div>{name}: {error.message}</div>
{/await}
