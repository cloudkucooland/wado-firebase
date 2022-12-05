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
  import { getContext, setContext, onMount, afterUpdate } from "svelte";
  import { writable } from "svelte/store";
  import user from "../model/user";

  const now = new Date();
  const nowString =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

  export let params = { officeName: currentOffice(), officeDate: nowString };
  let forProper = writable(proper.fromDate(params.officeDate));
  setContext("forProper", forProper);

  $: officeName = params.officeName;
  $: office = getOffice(officeName);

  let me = getContext("me");

  // for streak tracking
  let scrolled = false; // not yet scrolled to end

  onMount(() => {
    // console.log("proper onMount:", $forProper, "me", $me);
    // set the URL so that "poking the ox" always takes you to "now"
    window.location.assign("#/office/" + officeName + "/" + params.officeDate);
    screenView(officeName, { proper: $forProper.propername });
  });

  afterUpdate(() => {
    // console.log("proper afterUpdate:", $forProper, "me", $me);
    screenView(officeName, { proper: $forProper.propername });
  });

  async function scrolling() {
    if (scrolled) return; // remove the handler?
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      if (!auth.currentUser) return;
      scrolled = true;
      const res = await $me.UpdateStreak();
      toasts.success("Daily Streak", res);
    }
  }
</script>

<svelte:head>
  <title>WADO: {officeName}: {$forProper.propername}</title>
</svelte:head>

<svelte:window on:scroll|passive|stopPropagation={scrolling} />

<Container class="cover-container mx-auto">
  <Row>
    <Col xs="10">
      <TabContent
        on:tab={(e) => {
          if (officeName == e.detail) return;
          officeName = e.detail;
          window.location.replace(
            "#/office/" + officeName + "/" + params.officeDate
          );
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
          if (params.officeDate == e.target.value) return;
          window.location.assign(
            "#/office/" + officeName + "/" + e.target.value
          );
          $forProper = proper.fromDate(e.target.value);
        }}
        disabled={!$me.isEditor}
      />
    </Col>
  </Row>
  <Container>
    <Row>
      <Col>
        <Card>
          <CardHeader>{officeName}: {$forProper.propername}</CardHeader>
          <CardBody>
            <svelte:component this={office} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
</Container>
