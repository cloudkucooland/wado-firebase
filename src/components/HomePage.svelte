<script lang="ts">
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
  import { getOffice, offices, currentOffice } from "../model/offices";
  import { toasts } from "svelte-toasts";
  import { getContext, setContext, onMount, afterUpdate } from "svelte";
  import { push } from "svelte-spa-router";
  import { type Writable, writable } from "svelte/store";
  import type User from "../../types/model/user";

  const now: Date = new Date();
  const nowString: string =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

  export let params = { officeName: currentOffice(), officeDate: nowString };
  let forProper: Writable<proper> = writable(
    proper.fromDate(params.officeDate)
  );
  setContext("forProper", forProper);

  $: officeName = params.officeName;
  $: office = getOffice(officeName);

  let me: Writable<User> = getContext("me");

  // for streak tracking
  let scrolled: boolean = false; // not yet scrolled to end

  onMount(() => {
    // set the URL so that "poking the ox" always takes you to "now"
    push("/office/" + officeName + "/" + params.officeDate);
    screenView(officeName);
  });

  afterUpdate(() => {
    // figure out why this double-fires 
    screenView(officeName);
  });

  async function scrolling() {
    if (scrolled) return; // remove the handler?
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      if (!auth.currentUser) return;
      scrolled = true;
      if ($me.UpdateStreak) {
        const res = await $me.UpdateStreak();
        toasts.success("Daily Streak", res);
      }
    }
  }
</script>

<svelte:head>
  <title>WADO: {officeName}: {$forProper.propername}</title>
</svelte:head>

<svelte:window on:scroll|passive|stopPropagation={scrolling} />

<Container class="cover-container mx-auto {$forProper.season}">
  <Row>
    <Col xs="10">
      <TabContent
        on:tab={(e) => {
          if (officeName == e.detail) return;
          officeName = e.detail.toString();
          push("/office/" + officeName + "/" + params.officeDate);
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
          // @ts-ignore
          const t = e.target.value; // as HTMLInputElement;
          if (params.officeDate == t) return;
          $forProper = proper.fromDate(t);
          push("/office/" + officeName + "/" + t);
        }}
        disabled={!$me.isEditor}
      />
    </Col>
  </Row>
  <Container>
    <Row>
      <Col class="nopadding">
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
