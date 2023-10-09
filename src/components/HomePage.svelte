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
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "sveltestrap";
  import proper from "../model/proper";
  import { auth, screenView, db, recordEvent } from "../firebase";
  import { getOffice, currentOffice } from "../model/offices";
  import { toasts } from "svelte-toasts";
  import { getContext, setContext, onMount, afterUpdate } from "svelte";
  import { push, replace } from "svelte-spa-router";
  import { type Writable, type Readable, writable } from "svelte/store";
  import QuickEdit from "./QuickEdit.svelte";
  import AddAssoc from "./AddAssoc.svelte";
  import type User from "../../types/model/user";
  import type prayer from "../../types/model/prayer";
  import association from "../model/association";
  import { doc, setDoc, addDoc, collection } from "firebase/firestore";

  const now: Date = new Date();
  const nowString: string =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

  export let params = { officeName: currentOffice(), officeDate: nowString };
  console.debug(params.officeDate);
  const properFromDate = proper.fromDate(params.officeDate);
  console.debug(properFromDate);
  let forProper: Writable<proper> = writable(properFromDate);
  setContext("forProper", forProper);

  $: officeName = params.officeName;
  $: office = getOffice(officeName);

  let me: Readable<User> = getContext("me");

  // for streak tracking
  let scrolled: boolean = false; // not yet scrolled to end

  onMount((): void => {
    // set the URL so that "poking the ox" always takes you to "now"
    replace("/office/" + officeName + "/" + params.officeDate);
    screenView(officeName);
  });

  afterUpdate((): void => {
    screenView(officeName);
  });

  // handler for "high-score" tracking
  async function scrolling(): Promise<void> {
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

  // quick-edit handlers
  let quickEditData: prayer;
  let quickEditOpen: boolean = false;
  let qe: Writable<unknown> = writable(async (data: prayer): Promise<void> => {
    quickEditOpen = true;
    screenView("quickEdit");
    quickEditData = data;
  });
  setContext("qe", qe);

  // process quick-edit results
  async function qeconfirm(e: Event): Promise<void> {
    quickEditOpen = false;
    try {
      quickEditData.lastEditor = auth.currentUser.displayName;
      quickEditData.lastEdited = new Date().toISOString();
      await setDoc(
        doc(db, "prayers", quickEditData.id),
        quickEditData.toFirebase()
      );
      toasts.success("Saved Prayer", quickEditData.id);
      replace("/office/" + officeName + "/" + params.officeDate);
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }

  let quickAddAssocData: association = association.fromProper($forProper);
  let quickAddAssocLocation: string = "";
  let quickAddAssocOpen: boolean = false;
  let qaa: Writable<unknown> = writable(
    async (location: string): Promise<void> => {
      quickAddAssocLocation = location;
      quickAddAssocOpen = true;
      screenView("quickAddAssoc");
    }
  );
  setContext("qaa", qaa);

  async function qaaconfirm(e: Event): Promise<void> {
    console.log(e, quickAddAssocData.toFirebase());
    quickAddAssocOpen = false;
    try {
      const added = await addDoc(
        collection(db, "associations"),
        quickAddAssocData.toFirebase()
      );
      recordEvent("add_assoc", { new: added.id });
      toasts.success("Added Association", added.id);
      replace("/office/" + officeName + "/" + params.officeDate);
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }

  function offices(weekday: number): Array<string> {
    if (weekday == 6) {
      return new Array("Lauds", "Terce", "Sext", "None", "Vigil");
    }
    return new Array("Lauds", "Terce", "Sext", "None", "Vespers", "Compline");
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
        {#each offices($forProper.weekday) as o}
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

<Modal id="quickEditModal" isOpen={quickEditOpen} size="xl">
  <ModalHeader>Quick Edit</ModalHeader>
  <ModalBody>
    <QuickEdit bind:result={quickEditData} />
  </ModalBody>
  <ModalFooter>
    <Button
      color="secondary"
      size="sm"
      on:click={() => {
        quickEditOpen = false;
      }}
    >
      Cancel
    </Button>
    <Button color="success" size="sm" on:click={qeconfirm}>Confirm</Button>
  </ModalFooter>
</Modal>

<Modal id="quickAddAssoc" isOpen={quickAddAssocOpen} size="xl">
  <ModalHeader>Quick Add Association</ModalHeader>
  <ModalBody>
    <AddAssoc
      bind:result={quickAddAssocData}
      bind:location={quickAddAssocLocation}
    />
  </ModalBody>
  <ModalFooter>
    <Button
      color="secondary"
      size="sm"
      on:click={() => {
        quickAddAssocOpen = false;
      }}
    >
      Cancel
    </Button>
    <Button color="success" size="sm" on:click={qaaconfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
