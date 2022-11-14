<script>
  import { getDoc, doc } from "firebase/firestore";
  import { db } from "../firebase";
  import { onMount, beforeUpdate, afterUpdate, onDestroy } from "svelte";
  import association from "../model/association";
  import { Container, Row, Col, Input } from "sveltestrap";
  import { locations, seasons } from "../util";

  export let id;
  export let result;
  let a = {
    Location: "UNSET",
    Season: "Any",
    Proper: "Any",
    Weekday: "Any",
    Weight: "1",
  }; // preload

  onMount(async () => {
    console.log("EditAssoc onMount", id);
    const d = await getDoc(doc(db, "associations", id));
    a = new association(d);
    result = a;
  });

  // beforeUpdate(() => { console.log("beforeUpdate", id); });

  afterUpdate(() => {
    result = a;
    console.log("afterUpdate", result);
  });

  // onDestroy(() => { console.log("onDestroy", a); result = a;});
</script>

<Container fluid>
  <Row>
    <Col sm="2">
      <Input type="select" bind:value={a.Location}>
        {#each locations as l}
          <option value={l}>{l}</option>
        {/each}
      </Input>
    </Col>
    <Col sm="2">
      <Input bind:value={a.CalendarDate} placeholder="mm-dd" />
    </Col>
    <Col sm="2">
      <Input type="select" bind:value={a.Season}>
        <option value="Any">Any</option>
        {#each seasons as s}
          <option value={s}>{s}</option>
        {/each}
      </Input>
    </Col>
    <Col sm="1">
      <Input bind:value={a.Proper} />
    </Col>
    <Col sm="2">
      <Input type="select" bind:value={a.Weekday}>
        <option value="-1">Any</option>
        <option value="0">Sunday</option>
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
      </Input>
    </Col>
    <Col sm="2">
      <Input type="select" bind:value={a.Year}>
        <option value="Any">Any</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </Input>
    </Col>
    <Col sm="1">
      <Input bind:value={a.Weight} />
    </Col>
  </Row>
</Container>
