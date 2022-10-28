<script>
  import { recordEvent } from "../firebase";
  import {
    collection,
    query,
    where,
    getDoc,
    getDocs,
  } from "firebase/firestore";
  import { db } from "../firebase";
  import Hymn from "./Hymn.svelte";
  import Lection from "./Lection.svelte";
  import Prayer from "./Prayer.svelte";
  import Psalm from "./Psalm.svelte";

  export let name;
  export let proper;

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
    const q = query(
      collection(db, "associations"),
      where("Location", "==", name)
    );

    const res = await getDocs(q);
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
    <svelte:component this={lookup.get(d.Class)} data={d} />
  {/each}
{:catch error}
  <div>{name}: {error.message}</div>
{/await}
