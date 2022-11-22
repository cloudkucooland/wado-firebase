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
    FormGroup,
    Input,
  } from "sveltestrap";
  import proper from "../model/proper";
  import { screenView } from "../firebase";
  import { getOffice, offices } from "../model/offices";

  const now = new Date();
  const nowString =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

  export let params = { officeName: currentOffice(), officeDate: nowString };

  let officeDate = params.officeDate;

  // needs to be reactive
  $: officeName = params.officeName;
  $: forProper = proper.fromDate(officeDate);
  $: office = getOffice(officeName);

  screenView(officeName);

  // move this to model/offices.ts
  function currentOffice() {
    const d = new Date();
    const hour = d.getHours();

    if (hour >= 5 && hour < 9) return "Lauds";
    if (hour >= 9 && hour < 12) return "Terce";
    if (hour >= 12 && hour < 15) return "Sext";
    if (hour >= 15 && hour < 17) return "None";
    if (hour >= 17 && hour < 21) return "Vespers"; // if day is Saturday, do Vigil
    return "Compline";
  }

  // this shouldn't be needed, but bind isn't working below
  function setDate(e) {
    screenView(officeName);
    window.location.assign("#/office/" + officeName + "/" + e.srcElement.value);
    officeDate = e.srcElement.value;
    forProper = new proper(officeDate);
    office = getOffice(officeName); // does nothing?
  }
</script>

<svelte:head>
  <title>WADO: {officeName}: {forProper}</title>
</svelte:head>

<Container class="cover-container mx-auto">
  <Nav>
    {#each offices as o}
      <NavLink href="#/office/{o}/{officeDate}">{o}</NavLink>
    {/each}
    <FormGroup>
      <Input type="date" on:change={setDate} />
    </FormGroup>
  </Nav>

  <Container>
    <Row>
      <Col>
        <Card>
          <CardHeader>{officeName}: {forProper}</CardHeader>
          <CardBody>
            <svelte:component this={office} proper={forProper} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
</Container>
