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
    Tooltip,
  } from "sveltestrap";
  import proper from "../model/proper";
  import { auth, screenView } from "../firebase";
  import { getOffice, offices, currentOffice } from "../model/offices";
  import { toasts } from "svelte-toasts";
  import { onMount, afterUpdate, tick } from "svelte";
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

  async function scrolling() {
    if (scrolled) return; // remove the handler?
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      if (!auth.currentUser) return;
      scrolled = true;
      const me = await user.me();
      const res = await me.UpdateStreak();
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
        on:change={async (e) => {
          if (officeDate == e.target.value) return;
          officeDate = e.target.value;
          window.location.assign(
            "#/office/" + officeName + "/" + e.target.value
          );
          // officeName = officeName;
          await tick(); // still needed?
        }}
        type="date"
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
