<script>
  import {
    Container,
    Col,
    Row,
    Card,
    CardHeader,
    CardBody,
    Nav,
    NavLink,
    Form,
    FormGroup,
    Label,
    Input,
  } from "sveltestrap";
  import { FlatToast, ToastContainer } from "svelte-toasts";
  import { querystring } from "svelte-spa-router";
  import { parse } from "qs";
  import { recordEvent } from "../firebase";
  import proper from "../model/proper";
  import { currentOffice } from "../util.ts";

  import Lauds from "./Lauds.svelte";
  import Terce from "./Terce.svelte";
  import Sext from "./Sext.svelte";
  import None from "./None.svelte";
  import Vespers from "./Vespers.svelte";
  import Compline from "./Compline.svelte";

  export let params = { officeName: currentOffice() };
  $: officeName = params.officeName ? params.officeName : currentOffice();

  // link office name with component for drawing menu and switching
  const lut = new Map([
    ["Lauds", Lauds],
    ["Terce", Terce],
    ["Sext", Sext],
    ["None", None],
    ["Vespers", Vespers],
    ["Compline", Compline],
  ]);

  if (!lut.has(officeName)) {
    officeName = currentOffice();
  }
  $: office = lut.get(officeName);

  recordEvent(officeName);

  const now = new Date();
  const nowString =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
  $: forProper = new proper(nowString); // default to now, will be updated if a querystring is set before loading content

  $: {
    let parsed = parse($querystring); // when querystring updates, update parsed, which updates forProper
    if (typeof parsed !== "object") parsed = { t: nowString }; // unparsable?
    if (!parsed.hasOwnProperty("t")) parsed.t = nowString; // no t set
    forProper = new proper(parsed.t); // update forProper with the results of the query
  }

  function setDate(e) {
    forProper = new proper(e.srcElement.value);
    office = lut.get(officeName); // trigger a redraw
    document.getElementById("datepicker").dispatchEvent(new Event("submit"));
  }
</script>

<Container class="cover-container mx-auto">
  <!-- <ToastContainer let:data> <FlatToast {data} /> </ToastContainer> -->

  <Nav>
    {#each [...lut.keys()] as o}
      <NavLink href="#/office/{o}?{$querystring}">{o}</NavLink>
    {/each}
    <Form id="datepicker" action="#/office/{officeName}">
      <FormGroup>
        <!-- <Label for="t">Date</Label> -->
        <Input
          type="date"
          name="t"
          id="t"
          placeholder={nowString}
          on:change={setDate}
        />
      </FormGroup>
    </Form>
  </Nav>

  <Container>
    <Row>
      <Col>
        <Card>
          <CardHeader><h1>{officeName}: {forProper.toString()}</h1></CardHeader>
          <CardBody>
            <svelte:component this={office} proper={forProper} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
</Container>
