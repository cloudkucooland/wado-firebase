<script lang="ts">
  import { getDoc, doc } from "firebase/firestore";
  import { db } from "../firebase";
  import { onMount, afterUpdate } from "svelte";
  import association from "../model/association";
  import season from "../model/season";
  import { Container, Row, Col, Input } from "sveltestrap";

  export let id: string;
  export let result: association;
  export let addToID: string = "";
  const dummyData = {
    Location: "UNSET",
    Season: "Any",
    Proper: -1,
    Weekday: "Any",
    Weight: "1",
    Reference: doc(db, "ex", "nihilo"),
  };
  const dummy = {
    id: "",
    data: () => {
      return dummyData;
    },
  };
  let a: association = new association(dummy);

  let calDateSet: boolean = false;
  let selectedSeason: season = season.LUT.get(a.Season);
  let properName: string = "Proper";

  onMount(async () => {
    if (addToID != "") {
      // use the dummy data if adding
      dummyData.Reference = doc(db, "prayers", addToID);
      a = new association(dummy);
      result = a;
      return;
    }

    // get the current one, from firestore
    const d = await getDoc(doc(db, "associations", id));
    a = new association(d);
    selectedSeason = season.LUT.get(a.Season);
    result = a;
    if (result.CalendarDate !== "Any") {
      calDateSet = true;
    } else {
      calDateSet = false;
    }
    properName = selectedSeason.properName
      ? selectedSeason.properName
      : "Proper";
  });

  afterUpdate(() => {
    result = a;
    selectedSeason = season.LUT.get(a.Season);
    if (result.CalendarDate !== "Any") {
      calDateSet = true;
    } else {
      calDateSet = false;
    }
    properName = selectedSeason.properName
      ? selectedSeason.properName
      : "Proper";
  });
</script>

<Container fluid>
  <Row>
    <Col sm="2">Location</Col>
    <Col sm="10">
      <Input type="select" bind:value={a.Location}>
        {#each association.locations as l}
          <option value={l}>{l}</option>
        {/each}
      </Input>
    </Col>
  </Row>
  <Row>
    <Col sm="3">Season</Col>
    <Col sm="2">{properName} <span class="small">(-1 for "Any")</span></Col>
    <Col sm="3">Weekday</Col>
    <Col sm="2">Year</Col>
    <Col sm="2">Weight</Col>
  </Row>
  <Row>
    <Col sm="3">
      <Input type="select" bind:value={a.Season} disabled={calDateSet}>
        <option value="Any">Any</option>
        {#each Array.from(season.LUT.keys()) as s}
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
  <Row>
    <Col sm="2">&nbsp;</Col>
    <Col sm="8"
      >(fixed-dates are very rare; "Any" to use season-relative dates)</Col
    >
    <Col sm="2">&nbsp;</Col>
  </Row>
  <Row>
    <Col sm="2">Fixed Date</Col>
    <Col sm="10">
      <Input bind:value={a.CalendarDate} placeholder="mm-dd" />
    </Col>
  </Row>
</Container>
