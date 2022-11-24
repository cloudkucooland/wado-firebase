<script>
  import { collection, query, where } from "firebase/firestore";
  import { Spinner } from "sveltestrap";
  import { db, getDocCacheFirst, getDocsCacheFirst } from "../firebase";
  import season from "../model/season";

  export let office;
  export let proper;

  async function loaddata() {
    const s = season.LUT.get(proper.season);

    const wheres = new Array();
    wheres.push(where("season", "==", proper.season));
    if (s.maxProper > 0 && proper.proper >= 0)
      wheres.push(where("proper", "==", proper.proper));
    if (s.useWeekdays && proper.weekday >= 0)
      wheres.push(where("weekday", "==", proper.weekday));

    let q = query(collection(db, "lections", proper.year, "l"), ...wheres);

    let res = await getDocsCacheFirst(q);
    if (res.empty) return "No Psalm set for today, consult the lectionary";
    if (res.size != 1) console.log("multiple matches, this should not happen");
    return res.docs[0].data();
  }
</script>

{#await loaddata()}
  <Spinner color="secondary" />
{:then data}
  {#if office == "LAUDS"}
    {#if data._morning}
      {@html data._morning}
    {:else}
      <a
        href="https://www.biblegateway.com/passage/?search={data.morning}&version=NRSVUE"
      >
        {data.morning}
      </a>
    {/if}
  {:else if data._evening}
    {@html data._evening}
  {:else}
    <a
      href="https://www.biblegateway.com/passage/?search={data.evening}&version=NRSVUE"
    >
      {data.evening}
    </a>
  {/if}
{:catch error}
  <div>{name}: {error.message}</div>
{/await}
