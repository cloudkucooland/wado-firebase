<script>
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

  import Hymn from "./Hymn.svelte";
  import Lection from "./Lection.svelte";
  import Prayer from "./Prayer.svelte";
  import Psalm from "./Psalm.svelte";

  export let name;
  export let proper;
  export let max = 5;
  export let order = "weight";
  export let showall = false;
  export let bold = false;

  console.debug("Location: ", name, proper.toString());
  recordEvent(name);

  export const lookup = new Map([
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
      where("caldate", "==", proper.caldate),
      orderBy(order),
      limit(max)
    );

    let res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      prayers.push(doc.data());
    }
    if (prayers.length >= max) {
      console.log(prayers);
      return prayers;
    }

    // try with all the details
    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("season", "==", proper.season),
      where("proper", "==", proper.proper),
      orderBy(order),
      limit(max - prayers.length)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      prayers.push(doc.data());
    }
    if (prayers.length >= max) {
      console.log(prayers);
      return prayers;
    }

    // just season
    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      where("season", "==", proper.season),
      orderBy(order),
      limit(max - prayers.length)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      prayers.push(doc.data());
    }
    if (prayers.length >= max) {
      console.log(prayers);
      return prayers;
    }

    // just the location
    q = query(
      collection(db, "associations"),
      where("Location", "==", name),
      // orderBy(order),
      limit(max - prayers.length)
    );

    res = await getDocs(q);
    for (const a of res.docs) {
      const doc = await getDoc(a.data().Reference);
      prayers.push(doc.data());
    }

    return prayers;
  }
</script>

{#await loaddata()}
  <div>Loading {name}</div>
{:then data}
  {#each data as d}
    <svelte:component this={lookup.get(d.Class)} data={d} {bold} />
  {/each}
{:catch error}
  <div>{name}: {error.message}</div>
{/await}
