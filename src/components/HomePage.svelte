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
    Input,
  } from "sveltestrap";
  import proper from "../model/proper";
  import { recordEvent } from "../firebase";

  import Lauds from "./Lauds.svelte";
  import Terce from "./Terce.svelte";
  import Sext from "./Sext.svelte";
  import None from "./None.svelte";
  import Vespers from "./Vespers.svelte";
  import Compline from "./Compline.svelte";

  const now = new Date();
  const nowString =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

  export let params = { officeName: currentOffice(), officeDate: nowString };

  $: officeDate = params.officeDate ? params.officeDate : nowString;

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
  $: forProper = new proper(officeDate);

  recordEvent("screen_view", { firebase_screen: officeName });

  export function currentOffice() {
    const d = new Date();
    const hour = d.getHours();

    if (hour >= 5 && hour < 9) return "Lauds";
    if (hour >= 9 && hour < 12) return "Terce";
    if (hour >= 12 && hour < 15) return "Sext";
    if (hour >= 15 && hour < 17) return "None";
    if (hour >= 17 && hour < 21) return "Vespers"; // if day is Saturday, do Vigil
    return "Compline";
  }

  function setDate(e) {
    officeDate = e.srcElement.value;
    params.officeDate = e.srcElement.value;
    // trigger a drfresh somehow
    // office = lut.get(officeName);
  }
</script>

<Container class="cover-container mx-auto">
  <Nav>
    {#each [...lut.keys()] as o}
      <NavLink href="#/office/{o}/date/{officeDate}">{o}</NavLink>
    {/each}
    <Form>
      <FormGroup>
        <Input type="date" placeholder={nowString} on:change={setDate} />
      </FormGroup>
    </Form>
  </Nav>

  <Container>
    <Row>
      <Col>
        <Card>
          <CardHeader><h1>{officeName}</h1></CardHeader>
          <CardBody>
            <svelte:component this={office} proper={forProper} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
</Container>
