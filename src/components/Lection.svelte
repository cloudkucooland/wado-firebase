<script>
  import { collection, query, where } from "firebase/firestore";
  import { Spinner } from "sveltestrap";
  import { db, getDocsCacheFirst } from "../firebase";
  import season from "../model/season";

  export let office;
  export let proper;

  async function loaddata() {
    const s = season.LUT.get(proper.season);

    // this is how to dynamically build a query
    const wheres = new Array();
    wheres.push(where("season", "==", proper.season));
    if (s.maxProper > 0 && proper.proper >= 0)
      wheres.push(where("proper", "==", proper.proper));
    if (s.useWeekdays && proper.weekday >= 0)
      wheres.push(where("weekday", "==", proper.weekday));

    let q = query(collection(db, "lections", proper.year, "l"), ...wheres);

    let res = await getDocsCacheFirst(q);
    if (res.empty)
      return {
        _morning: "No passage set for today, consult the lectionary",
        _evening: "No passage set for today, consult the lectionary",
      };
    return res.docs[0].data();
  }
</script>

{#await loaddata()}
  <Spinner color="secondary" />
{:then data}
  {#if office == "LAUDS"}
    {#if data.morningtitle}<h5>{data.morningtitle}</h5>{/if}
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
    {#if data.eveningtitle}<h5>{data.eveningtitle}</h5>{/if}
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
{:catch error}
  <div>{error.message}</div>
{/await}
