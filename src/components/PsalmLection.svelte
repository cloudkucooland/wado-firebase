<script lang="ts">
  import { collection, query, where, doc } from "firebase/firestore";
  import { db, getDocCacheFirst, getDocsCacheFirst } from "../firebase";
  import season from "../model/season";
  import Psalm from "./prayerClasses/Psalm.svelte";
  import { toasts } from "svelte-toasts";
  import { getContext } from "svelte";
  import type Proper from "../../types/model/proper";
  import type { Readable } from "svelte/store";
  import { Spinner } from "sveltestrap";

  export let office: string;
  let proper: Readable<Proper> = getContext("forProper");

  class plClass {
    id: string;
    morningpsalm?: string;
    eveningpsalm?: string;
    _morningpsalmref?: string;
    _eveningpsalmref?: string;
    _resolved?: any; // model/psalm

    constructor(obj: any) {
      if (obj.id) this.id = obj.id;
      if (obj.morningpsalm) this.morningpsalm = obj.morningpsalm;
      if (obj.eveningpsalm) this.eveningpsalm = obj.eveningpsalm;
      if (obj._morningpsalmref) this._morningpsalmref = obj._morningpsalmref;
      if (obj._eveningpsalmref) this._eveningpsalmref = obj._eveningpsalmref;
    }
  }

  async function loaddata(p: Proper): Promise<plClass> {
    const s: season = season.LUT.get(p.season);

    const wheres = new Array();
    wheres.push(where("season", "==", p.season));
    if (s.maxProper > 0 && p.proper >= 0)
      wheres.push(where("proper", "==", p.proper));
    if (s.useWeekdays && p.weekday >= 0)
      wheres.push(where("weekday", "==", p.weekday));

    let q = query(collection(db, "lections", p.year, "l"), ...wheres);

    let res = await getDocsCacheFirst(q);
    if (res.empty) {
      toasts.error("Empty psalm lection, using default");
      console.log("empty psalm lection");
      return new plClass({
        id: "Empty Result...",
        morningpsalm: "Psalm 1",
        eveningpsalm: "Psalm 150",
      });
    }

    if (res.size != 1) {
      toasts.error("Multiple psalm lection matches");
      console.log("multiple matches, this should not happen", p);
      for (const psalm of res.docs) {
        console.log(psalm.data());
      }
    }
    const d = new plClass(res.docs[0].data());

    if (office == "LAUDS" && d._morningpsalmref) {
      try {
        const ps = doc(db, "prayers", d._morningpsalmref);
        const res = await getDocCacheFirst(ps);
        d._resolved = res.data();
        d.id = d._morningpsalmref;
      } catch (err) {
        console.log(err);
        toasts.error(err.message);
      }
    }
    if (office != "LAUDS" && d._eveningpsalmref) {
      try {
        const ps = doc(db, "prayers", d._eveningpsalmref);
        const res = await getDocCacheFirst(ps);
        d._resolved = res.data();
        d.id = d._eveningpsalmref;
      } catch (err) {
        console.log(err);
        toasts.error(err.message);
      }
    }
    return d;
  }
</script>

{#await loaddata($proper)}
  <Spinner color="primary" />
{:then data}
  {#if data._resolved}
    <Psalm data={data._resolved} id={data.id} />
  {:else if office == "LAUDS"}
    <a
      href="https://www.biblegateway.com/passage/?search={data.morningpsalm}&version=NRSVUE"
      >{data.morningpsalm}</a
    >
  {:else if office != "LAUDS"}
    <a
      href="https://www.biblegateway.com/passage/?search={data.eveningpsalm}&version=NRSVUE"
      >{data.eveningpsalm}</a
    >
  {:else}
    <h5>No Psalm Specified for today</h5>
  {/if}
{:catch error}
  <h5>Unable to load: {error.message}</h5>
{/await}
