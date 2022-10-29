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
  let officeName = params.officeName ? params.officeName : currentOffice();

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

  recordEvent(officeName);

  const forProper = new proper({ caldate: "12-22", season: "advent", week: 4 }); // determine from clock or query
  const office = lut.get(officeName);
</script>

<Container class="cover-container mx-auto">
  <ToastContainer let:data>
    <FlatToast {data} />
  </ToastContainer>

  <Nav>
    <NavLink href="/wado/#/office/Lauds">Lauds</NavLink>
    <NavLink href="#/office/Terce">Terce</NavLink>
    <NavLink href="#/office/Sext">Sext</NavLink>
    <NavLink href="#/office/None">None</NavLink>
    <NavLink href="#/office/Vespers">Vespers</NavLink>
    <NavLink href="#/office/Compline">Compline</NavLink>
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
