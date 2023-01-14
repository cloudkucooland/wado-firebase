<script lang="ts">
  import {
    collection,
    query,
    where,
    limit,
    orderBy,
    getDocs,
  } from "firebase/firestore";
  import { db, getDocCacheFirst, getDocsCacheFirst } from "../firebase";
  import { showEdit, showAlt } from "../model/preferences";
  import { getContext } from "svelte";
  import Alternatives from "./Alternatives.svelte";
  import { link, push } from "svelte-spa-router";
  import type { Readable } from "svelte/store";
  import type proper from "../../types/model/proper";
  import { Spinner, Icon } from "sveltestrap";

  import Heartwords from "./prayerClasses/Heartwords.svelte";
  import Hymn from "./prayerClasses/Hymn.svelte";
  import Prayer from "./prayerClasses/Prayer.svelte";
  import Psalm from "./prayerClasses/Psalm.svelte";
  import Antiphon from "./prayerClasses/Antiphon.svelte";
  import Commemoration from "./prayerClasses/Commemoration.svelte";
  import type { prayerFromFirestore } from "../model/types";

  let proper: Readable<proper> = getContext("forProper");
  let qaa: Readable<any> = getContext("qaa");

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
    ["commemoration", Commemoration],
  ]);

  if (typeof max !== "number") max = +max;
  if (typeof maxAlt !== "number") maxAlt = +maxAlt;
  const realMax = maxAlt > max ? maxAlt : max;

  const order = "Weight";

  // this needs to be refactored
  async function loaddata(
    p: proper
  ): Promise<Map<string, prayerFromFirestore>> {
    const m: Map<string, prayerFromFirestore> = new Map();

    const doQuery = async (q) => {
      try {
        const res = await getDocs(q);
        for (const a of res.docs) {
          const ad = a.data(); // as assocFromFirestore
          const d = await getDocCacheFirst(ad.Reference);
          const dd = d.data() as prayerFromFirestore;
          if (dd.License) m.set(d.id, dd);
        }
      } catch (err) {
        console.log(err);
        // toasts.error(err.message);
      }
    };

    // try with caldate
    await doQuery(
      query(
        collection(db, "associations"),
        where("Location", "==", name),
        where("CalendarDate", "==", p.caldate),
        orderBy(order),
        limit(realMax)
      )
    );
    if (m.size >= realMax) {
      return m;
    }

    // try with all the details
    await doQuery(
      query(
        collection(db, "associations"),
        where("Location", "==", name),
        where("CalendarDate", "==", "Any"),
        where("Season", "==", p.season),
        where("Proper", "==", p.proper),
        where("Weekday", "==", p.weekday),
        where("Year", "==", p.year),
        orderBy(order),
        limit(realMax - m.size)
      )
    );
    if (m.size >= realMax) {
      return m;
    }

    // Any Year
    await doQuery(
      query(
        collection(db, "associations"),
        where("Location", "==", name),
        where("CalendarDate", "==", "Any"),
        where("Season", "==", p.season),
        where("Proper", "==", p.proper),
        where("Weekday", "==", p.weekday),
        where("Year", "==", "Any"),
        orderBy(order),
        limit(realMax - m.size)
      )
    );
    if (m.size >= realMax) {
      return m;
    }

    // Any Year or Day
    await doQuery(
      query(
        collection(db, "associations"),
        where("Location", "==", name),
        where("CalendarDate", "==", "Any"),
        where("Season", "==", p.season),
        where("Proper", "==", p.proper),
        where("Weekday", "==", -1),
        where("Year", "==", "Any"),
        orderBy(order),
        limit(realMax - m.size)
      )
    );
    if (m.size >= realMax) {
      return m;
    }

    // Season/Weekday
    await doQuery(
      query(
        collection(db, "associations"),
        where("Location", "==", name),
        where("CalendarDate", "==", "Any"),
        where("Season", "==", p.season),
        where("Proper", "==", -1),
        where("Weekday", "==", p.weekday),
        where("Year", "==", "Any"),
        orderBy(order),
        limit(realMax - m.size)
      )
    );
    if (m.size >= realMax) {
      return m;
    }

    // Season only
    await doQuery(
      query(
        collection(db, "associations"),
        where("Location", "==", name),
        where("CalendarDate", "==", "Any"),
        where("Season", "==", p.season),
        where("Proper", "==", -1),
        where("Weekday", "==", -1),
        where("Year", "==", "Any"),
        orderBy(order),
        limit(realMax - m.size)
      )
    );
    if (m.size >= realMax) {
      return m;
    }

    // Location, anys
    await doQuery(
      query(
        collection(db, "associations"),
        where("Location", "==", name),
        where("CalendarDate", "==", "Any"),
        where("Season", "==", "Any"),
        where("Proper", "==", -1),
        where("Weekday", "==", -1),
        where("Year", "==", "Any"),
        orderBy(order),
        limit(realMax - m.size)
      )
    );

    if (m.size == 0) console.debug("no results found for", name);
    return m;
  }
</script>

{#await loaddata($proper)}
  <Spinner color="primary" />
{:then data}
  {#if $showEdit}
    <div class="edit">
      {name}
      <button
        on:click={() => {
          push("#/editlocation/" + name);
        }}
      >
        <Icon name="calendar-week" />
      </button>
      <button
        on:click={() => {
          $qaa(name);
        }}
      >
        <Icon name="calendar-plus" />
      </button>
    </div>
  {/if}
  {#if maxAlt > 0 && $showAlt && data.size > 1}
    <Alternatives {data} />
  {:else}
    {#each [...data] as [id, d]}
      <svelte:component this={lookup.get(d.Class)} data={d} {id} {bold} />
    {/each}
  {/if}
{:catch error}
  <h5>Unable to load: {error.message}</h5>
{/await}
