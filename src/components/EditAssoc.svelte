<script>
  import { getDoc, doc } from "firebase/firestore";
  import { db } from "../firebase";
  import { onMount, beforeUpdate, afterUpdate, onDestroy } from "svelte";
  import association from "../model/association";
  import { Container, Row, Col, Input } from "sveltestrap";
  import { locations, seasons, seasonLUT } from "../util";

  export let id;
  export let result;
  let a = {
    Location: "UNSET",
    Season: "Any",
    Proper: "Any",
    Weekday: "Any",
    Weight: "1",
  }; // preload fake data until onMount completes

  let calDateSet = false;
  let selectedSeason = seasonLUT.get("Any");

  onMount(async () => {
    const d = await getDoc(doc(db, "associations", id));
    a = new association(d);
    selectedSeason = seasonLUT.get(a.Season);
    result = a;
    if (result.CalendarDate !== "Any") {
      calDateSet = true;
    } else {
      calDateSet = false;
    }
  });

  afterUpdate(() => {
    result = a;
    selectedSeason = seasonLUT.get(a.Season);
    if (result.CalendarDate !== "Any") {
      calDateSet = true;
    } else {
      calDateSet = false;
    }
  });
</script>

<Container fluid>
  <Row>
    <Col sm="2">Location</Col>
    <Col sm="10">
      <Input type="select" bind:value={a.Location}>
        {#each locations as l}
          <option value={l}>{l}</option>
        {/each}
      </Input>
    </Col>
  </Row>
  <Row>
    <Col sm="2">Calendar Date</Col>
    <Col sm="10">
      <Input bind:value={a.CalendarDate} placeholder="mm-dd" />
    </Col>
  </Row>
  <Row>
    <Col sm="5">&nbsp;</Col>
    <Col sm="2">- OR -</Col>
    <Col sm="5">&nbsp;</Col>
  </Row>
  <Row>
    <Col sm="3">Season</Col>
    <Col sm="2">Proper</Col>
    <Col sm="3">Weekday</Col>
    <Col sm="2">Year</Col>
    <Col sm="2">Weight</Col>
  </Row>
  <Row>
    <Col sm="3">
      <Input type="select" bind:value={a.Season} disabled={calDateSet}>
        <option value="Any">Any</option>
        {#each seasons as s}
          <option value={s}>{s}</option>
        {/each}
      </Input>
    </Col>
    <Col sm="2">
      <Input
        bind:value={a.Proper}
        type="number"
        max={selectedSeason.maxProper}
        min={-1}
        disabled={calDateSet || selectedSeason.maxProper == 0}
      />
    </Col>
    <Col sm="3">
      <Input
        type="select"
        bind:value={a.Weekday}
        disabled={calDateSet || !selectedSeason.useWeekdays}
      >
        <option value={-1}>Any</option>
        <option value={0}>Sunday</option>
        <option value={1}>Monday</option>
        <option value={2}>Tuesday</option>
        <option value={3}>Wednesday</option>
        <option value={4}>Thursday</option>
        <option value={5}>Friday</option>
        <option value={6}>Saturday</option>
      </Input>
    </Col>
    <Col sm="2">
      <Input type="select" bind:value={a.Year} disabled={calDateSet}>
        <option value="Any">Any</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </Input>
    </Col>
    <Col sm="2">
      <Input
        bind:value={a.Weight}
        type="number"
        min={0}
        max={99}
        disabled={calDateSet}
      />
    </Col>
  </Row>
</Container>
