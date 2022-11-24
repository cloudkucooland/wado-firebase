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
    if (res.empty)
      return {
        _morningpsalm:
          "<h2>No Psalm set for today, consult the lectionary</h2><br />",
        _eveningpsalm:
          "<h2>No Psalm set for today, consult the lectionary</h2><br />",
      };
    if (res.size != 1) {
      // toasts?
      console.log("multiple matches, this should not happen");
    }
    return res.docs[0].data();
  }
</script>

{#await loaddata()}
  <Spinner color="secondary" />
{:then data}
  {#if office == "LAUDS"}
    {#if data._morningpsalm}
      {@html data._morningpsalm}
    {:else}
      <a
        href="https://www.biblegateway.com/passage/?search={data.morningpsalm}&version=NRSVUE"
      >
        {data.morningpsalm}
      </a>
    {/if}
  {:else if data._eveningpsalm}
    {@html data._eveningpsalm}
  {:else}
    <a
      href="https://www.biblegateway.com/passage/?search={data.eveningpsalm}&version=NRSVUE"
    >
      {data.eveningpsalm}
    </a>
  {/if}
{:catch error}
  <div>{name}: {error.message}</div>
{/await}
