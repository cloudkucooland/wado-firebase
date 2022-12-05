<script>
  import { collection, query, where, doc } from "firebase/firestore";
  import { Spinner } from "sveltestrap";
  import { db, getDocCacheFirst, getDocsCacheFirst } from "../firebase";
  import season from "../model/season";
  import Psalm from "./prayerClasses/Psalm.svelte";
  import { toasts } from "svelte-toasts";
  import { getContext } from "svelte";

  export let office;
  let proper = getContext("forProper");

  async function loaddata() {
    const s = season.LUT.get($proper.season);

    const wheres = new Array();
    wheres.push(where("season", "==", $proper.season));
    if (s.maxProper > 0 && $proper.proper >= 0)
      wheres.push(where("proper", "==", $proper.proper));
    if (s.useWeekdays && $proper.weekday >= 0)
      wheres.push(where("weekday", "==", $proper.weekday));

    let q = query(collection(db, "lections", $proper.year, "l"), ...wheres);

    let res = await getDocsCacheFirst(q);
    if (res.empty)
      return {
        morningpsalm: "Lectionary incomplete",
        _morningpsalm:
          "<h5>No Psalm set for today, consult the lectionary</h5><br />",
        eveningpsalm: "Lectionary incomplete",
        _eveningpsalm:
          "<h5>No Psalm set for today, consult the lectionary</h5><br />",
      };
    if (res.size != 1) {
      toasts.error("Multiple lection matches?!");
      console.log("multiple matches, this should not happen");
    }
    const d = res.docs[0].data();

    if (office == "LAUDS" && d._morningpsalmref) {
      try {
        const ps = doc(db, "prayers", d._morningpsalmref);
        const res = await getDocCacheFirst(ps);
        d._morningpsalmresolved = res.data();
      } catch (err) {
        console.log(err);
        toasts.error(err.message);
      }
    }
    if (office != "LAUDS" && d._eveningpsalmref) {
      try {
        const ps = doc(db, "prayers", d._eveningpsalmref);
        const res = await getDocCacheFirst(ps);
        d._eveningpsalmresolved = res.data();
      } catch (err) {
        console.log(err);
        toasts.error(err.message);
      }
    }
    return d;
  }
</script>

{#await loaddata()}
  <Spinner color="secondary" />
{:then data}
  {#if office == "LAUDS"}
    {#if data._morningpsalmresolved}
      <Psalm data={data._morningpsalmresolved} />
    {:else}
      <a
        href="https://www.biblegateway.com/passage/?search={data.morningpsalm}&version=NRSVUE"
      >
        {data.morningpsalm}
      </a>
    {/if}
  {:else if data._eveningpsalmresolved}
    <Psalm data={data._eveningpsalmresolved} />
  {:else}
    <a
      href="https://www.biblegateway.com/passage/?search={data.eveningpsalm}&version=NRSVUE"
    >
      {data.eveningpsalm}
    </a>
  {/if}
{:catch error}
  <div>{error.message}</div>
{/await}
