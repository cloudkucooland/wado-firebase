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
  import { auth, screenView } from "../firebase";
  import { getOffice, offices } from "../model/offices";
  import { toasts } from "svelte-toasts";
  import { onMount, afterUpdate } from "svelte";
  import user from "../model/user";

  const now = new Date();
  const nowString =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

  export let params = { officeName: currentOffice(), officeDate: nowString };
  $: officeDate = params.officeDate;
  $: forProper = proper.fromDate(officeDate);
  $: officeName = params.officeName;
  $: office = getOffice(officeName);

  // for streak tracking
  let scrolled = false; // not yet scrolled to end

  onMount(() => {
    // set the URL so that "poking the ox" always takes you to "now"
    window.location.assign("#/office/" + officeName + "/" + officeDate);
    screenView(officeName, { proper: forProper.propername });
  });

  afterUpdate(() => {
    // console.log("afterUpdate", forProper.propername, forProper);
    screenView(officeName, { proper: forProper.propername });
  });

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

  async function scrolling() {
    if (scrolled) return; // remove the handler?
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      if (!auth.currentUser) return;
      scrolled = true;
      const res = await user.UpdateStreak(auth.currentUser.uid);
      toasts.success("Daily Streak", res);
    }
  }
</script>

<svelte:head>
  <title>WADO: {officeName}: {forProper.propername}</title>
</svelte:head>

<svelte:window on:scroll|passive|stopPropagation={scrolling} />

<Container class="cover-container mx-auto">
  <Row>
    <Col xs="10">
      <TabContent
        on:tab={(e) => {
          if (officeName == e.detail) return;
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
          // if (officeDate == e.target.value) return;
          officeDate = e.target.value;
          window.location.assign("#/office/" + officeName + "/" + officeDate);
          forProper = proper.fromDate(officeDate); // updates w/o this, but one late...
          // officeName = officeName;
          // console.log(officeName, e.target.value, forProper.propername);
        }}
      />
    </Col>
  </Row>
  <Container>
    <Row>
      <Col>
        <Card>
          <CardHeader>{officeName}: {forProper.propername}</CardHeader>
          <CardBody>
            <svelte:component this={office} proper={forProper} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
</Container>
