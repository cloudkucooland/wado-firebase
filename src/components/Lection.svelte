<script lang="ts">
  import { collection, query, where } from "firebase/firestore";
  import { db, getDocsCacheFirst } from "../firebase";
  import season from "../model/season";
  import { getContext } from "svelte";
  import type Proper from "../../types/model/proper";
  import type { Readable } from "svelte/store";
  import lection from "../model/lection";
  import { Spinner } from "sveltestrap";

  export let office: string;
  let proper: Readable<Proper> = getContext("forProper");
  let data: lection = { morning: "Loading", evening: "Loading" };

  async function loaddata(p: Proper): Promise<lection> {
    const s: season = season.LUT.get(p.season);

    // this is how to dynamically build a query
    const wheres = new Array();
    wheres.push(where("season", "==", p.season));
    if (s.maxProper > 0 && p.proper >= 0)
      wheres.push(where("proper", "==", p.proper));
    if (s.useWeekdays && p.weekday >= 0)
      wheres.push(where("weekday", "==", p.weekday));

    let q = query(collection(db, "lections", p.year, "l"), ...wheres);

    let res = await getDocsCacheFirst(q);
    if (res.empty)
      return {
        _morning: "No passage set for today, consult the lectionary",
        _evening: "No passage set for today, consult the lectionary",
      };
    return new lection(res.docs[0].data());
  }
</script>

{#await loaddata($proper)}
  <Spinner />
{:then data}
  {#if office == "LAUDS"}
    {#if data.morningtitle}<h5>{data.morning}: {data.morningtitle}</h5>{/if}
    {#if data._morning}
      <p>{@html data._morning}</p>
    {:else}
      <p>
        <a
          href="https://www.biblegateway.com/passage/?search={data.morning}&version=NRSVUE"
        >
          {data.morning}
        </a>
      </p>
    {/if}
  {:else}
    {#if data.eveningtitle}<h5>{data.evening}: {data.eveningtitle}</h5>{/if}
    {#if data._evening}
      <p>{@html data._evening}</p>
    {:else}
      <p>
        <a
          href="https://www.biblegateway.com/passage/?search={data.evening}&version=NRSVUE"
        >
          {data.evening}
        </a>
      </p>
    {/if}
  {/if}
{/await}

<style>
  p {
    font-family: Georgia, serif;
    line-height: 1.25em;
    word-wrap: break-word;
  }
</style>
