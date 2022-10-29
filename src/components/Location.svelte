<script>
  // type="ts"
  import { recordEvent } from "../firebase";
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

  export let name;
  export let proper;
  export let max = 5;
  export let order = "Weight";
  export let showall = false;
  export let bold = false;

  if (typeof max !== "number") {
    max = +max;
  }

  console.debug("Location: ", name, proper.toString());
  recordEvent(name);

  export const lookup = new Map([
    ["heartwords", Heartwords],
    ["other", Prayer],
    ["hymn", Hymn],
    ["lection", Lection],
    ["prayer", Prayer],
    ["psalm", Psalm],
  ]);

  async function loaddata() {
    const prayers = [];

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
      prayers.push(doc.data());
    }
    if (prayers.length >= max) {
      console.debug("calendar date", prayers.length);
      return prayers;
    }

    // try with all the details
    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Season", "==", proper.season),
      where("Proper", "==", proper.proper),
      orderBy(order),
      limit(max - prayers.length)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      prayers.push(doc.data());
    }
    if (prayers.length >= max) {
      console.debug("season and proper", prayers.length);
      return prayers;
    }

    // just season
    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("Season", "==", proper.season),
      orderBy(order),
      limit(max - prayers.length)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      prayers.push(doc.data());
    }
    if (prayers.length >= max) {
      console.debug("season only", prayers.length);
      return prayers;
    }

    // just the location
    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      orderBy(order),
      limit(max - prayers.length)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      prayers.push(doc.data());
    }
    console.debug("location only", prayers.length);

    return prayers;
  }
</script>

{#await loaddata()}
  <div>Loading {name}</div>
{:then data}
  {#each data as d}
    <svelte:component this={lookup.get(d.Class)} data={d} {bold} {showall} />
  {/each}
{:catch error}
  <div>{name}: {error.message}</div>
{/await}
