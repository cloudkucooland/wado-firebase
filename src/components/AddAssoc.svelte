<script lang="ts">
  import { doc } from "firebase/firestore";
  import { db } from "../firebase";
  import { onMount, afterUpdate } from "svelte";
  import association from "../model/association";
  import type { associationFromFirestore } from "../model/types";
  import season from "../model/season";
  import { Container, Row, Col, Input, Button } from "sveltestrap";
  import Select from "svelte-select";
  import { index } from "../meili";
  import { toasts } from "svelte-toasts";

  export let result: association;
  export let location: string = "";
  let a: association = new association("", {
    Location: location,
    Season: result && result.Season ? result.Season : "Any",
    Proper: result && result.Proper ? +result.Proper : -1,
    Weekday: result && result.Weekday ? +result.Weekday : -1,
    Year: result && result.Year ? result.Year : "Any",
    Weight: result && result.Weight ? +result.Weight : 1,
    Reference:
      result && result.Reference ? result.Reference : doc(db, "ex", "nihilo"),
  } as associationFromFirestore);
  console.log("location", location, "incoming", result, "built", a);

  let calDateSet: boolean = false;
  let selectedSeason: season = season.LUT.get(a.Season);
  let properName: string = "Proper";

  onMount(async () => {
    result = a;
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

  async function loadOptions(searchString: string) {
    // console.log(searchString);
    const items = [];

    try {
      const searchresult = await index.search(searchString, {
        attributesToRetrieve: ["fsid", "Name", "Class"],
        filter: [
          [
            "Class = Prayer",
            "Class = Hymn",
            "Class = Antiphon",
            "Class = Commemoration",
          ],
        ],
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
    console.log(e.detail);
    try {
      a.Reference = doc(db, "prayers", e.detail.value);
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }

  const groupBy = (item: any) => item.group;
</script>

<Container fluid>
  <Row>
    <Col sm="2">Location</Col>
    <Col sm="6">
      {location}
    </Col>
    <Col sm="4">
      <Button href="#/addPrayer">Add Prayer</Button>
    </Col>
  </Row>
  <Row>
    <Col sm="2">Prayer</Col>
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
        <option
          value="Any"
          on:change={() => {
            a.Proper = -1;
            a.Weekday = -1;
          }}>Any</option
        >
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
    <Col sm="8">
      (fixed-dates are very rare; "Any" to use season-relative dates)
    </Col>
    <Col sm="2">&nbsp;</Col>
  </Row>
  <Row>
    <Col sm="2">Fixed Date</Col>
    <Col sm="10">
      <Input bind:value={a.CalendarDate} placeholder="mm-dd" />
    </Col>
  </Row>
</Container>
