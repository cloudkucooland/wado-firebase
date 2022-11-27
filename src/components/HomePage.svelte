<script>
  import {
    Container,
    Col,
    Row,
    Card,
    CardHeader,
    CardBody,
    TabContent,
    TabPane,
    Input,
  } from "sveltestrap";
  import proper from "../model/proper";
  import { screenView } from "../firebase";
  import { getOffice, offices } from "../model/offices";

  const now = new Date();
  const nowString =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

  export let params = { officeName: currentOffice(), officeDate: nowString };

  $: officeDate = params.officeDate;
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
</script>

<svelte:head>
  <title>WADO: {officeName}: {forProper}</title>
</svelte:head>

<Container class="cover-container mx-auto">
  <Row>
    <Col xs="10">
      <TabContent
        on:tab={(e) => {
          if (officeName == e.detail) return;
          screenView(officeName);
          officeName = e.detail;
          window.location.replace("#/office/" + officeName + "/" + officeDate);
        }}
      >
        {#each offices as o}
          <TabPane tabId={o} tab={o} active={officeName == o} />
        {/each}
      </TabContent>
    </Col>
    <Col xs="2">
      <Input
        type="date"
        on:change={(e) => {
          if (officeDate == e.srcElement.value) return;
          screenView(officeName);
          officeDate = e.srcElement.value;
          window.location.assign("#/office/" + officeName + "/" + officeDate);
          forProper = proper.fromDate(officeDate); // updates w/o this, but one late...
          officeName = officeName;
          console.log(officeName, e.srcElement.value, forProper);
        }}
      />
    </Col>
  </Row>
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
