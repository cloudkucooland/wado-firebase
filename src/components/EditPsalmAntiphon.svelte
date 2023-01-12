<script lang="ts">
  import { db } from "../firebase";
  import { Input, Button, Row, Col } from "sveltestrap";
  import { toasts } from "svelte-toasts";
  import { doc } from "firebase/firestore";
  import { onMount, afterUpdate } from "svelte";
  import Select from "svelte-select";
  import { index } from "../meili";
  import type { DocumentReference } from "firebase/firestore";

  export let result: DocumentReference;
  let resolved;

  async function loadOptions(searchString: string) {
    const items = [];

    try {
      const searchresult = await index.search(searchString, {
        attributesToRetrieve: ["fsid", "Name", "Class"],
        filter: [["Class = Antiphon"]],
      });

      for (const r of searchresult.hits) {
        items.push({ value: r.fsid, label: r.Name, group: r.Class });
      }
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
    return items;
  }

  function doSelect(e: any) {
    console.debug(e.detail);
    try {
      const r = doc(db, "prayers", e.detail.value);
      console.debug(r);
      result = r.ref;
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }

  onMount(
    (async() = {
      if(result) {
        try {
          console.debug(result);
          resolved = await result.Data();
          console.debug(resolved);
        } catch (err) {
          console.log(err);
          toasts.error(err.message);
        }
      },
    })
  );

  const groupBy = (item: any) => item.group;
</script>

<Container>
  <Row>
    <Col sm="12">
      {#if resolved}
        <h3><a href="#/prayer/{resolved.id}">{resolved.Name}</a></h3>
      {/if}
    </Col>
  </Row>
  <Row>
    <Col sm="2">Search:</Col>
    <Col sm="10">
      <Select
        name="prayer"
        placeholder="search for prayer"
        {loadOptions}
        on:change={doSelect}
        {groupBy}
      />
    </Col>
  </Row>
</Container>
