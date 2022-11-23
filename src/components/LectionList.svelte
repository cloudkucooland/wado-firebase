<script>
  import {
    Container,
    Row,
    Col,
    Nav,
    NavLink,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Button,
  } from "sveltestrap";
  import {
    collection,
    query,
    where,
    limit,
    doc,
    addDoc,
    setDoc,
  } from "firebase/firestore";
  import {
    db,
    recordEvent,
    isEditor,
    screenView,
    getDocsCacheFirst,
  } from "../firebase";
  import proper from "../model/proper";
  import { onMount } from "svelte";
  import { toasts } from "svelte-toasts";

  export let params; //  = { y };
  $: year = params.y ? params.y : "A";
  $: lections = new Map();
  let editorPerm = false;
  $: modalData = {};

  async function loadLections(y) {
    const ay = proper.AllYear(y);

    for (const [k, v] of ay) {
      try {
        const q = query(
          collection(db, "lections", y, "l"),
          where("season", "==", v.season),
          where("weekday", "==", v.weekday),
          where("proper", "==", v.proper),
          limit(1)
        );
        const res = await getDocsCacheFirst(q);
        for (const a of res.docs) {
          const n = a.data();
          v.path = a.ref.path;
          v.morning = n.morning;
          v.evening = n.evening;
          v.morningpsalm = n.morningpsalm;
          v.eveningpsalm = n.eveningpsalm;
          ay.set(k, v); // update with data from firestore
        }
      } catch (e) {
        toasts.error(e.message);
        console.log(e);
      }
    }
    return ay;
  }

  onMount(async () => {
    lections = await loadLections(year);
    screenView("Lection List");
    editorPerm = await isEditor();
  });

  let lectionModalOpen = false;
  async function toggleLectionModalOpen(e) {
    screenView("lectionModalOpen");
    lectionModalOpen = !lectionModalOpen;

    if (lectionModalOpen) {
      const v = lections.get(e.target.value);
      modalData = {
        morning: v.morning,
        evening: v.evening,
        morningpsalm: v.morningpsalm,
        eveningpsalm: v.eveningpsalm,
        season: v.season,
        proper: v.proper,
        weekday: v.weekday,
        path: v.path,
        key: e.target.value,
      };
    }
  }

  async function confirmLectionModal() {
    // console.debug("from modal", modalData);
    recordEvent("edit_lection", { key: modalData.key });
    lectionModalOpen = !lectionModalOpen;

    const data = {
      morning: modalData.morning,
      morningpsalm: modalData.morningpsalm,
      evening: modalData.evening,
      eveningpsalm: modalData.eveningpsalm,
      season: modalData.season,
      proper: modalData.proper,
      weekday: modalData.weekday,
    };
    // console.debug("to firestore", data);

    try {
      if (modalData.path == "" || typeof modalData.path == "undefined") {
        const added = await addDoc(collection(db, "lections", year, "l"), data);
        modelData.path = added.ref.path;
      } else {
        await setDoc(doc(db, modalData.path), data);
      }
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
    lections.set(modalData.key, modalData);
    toasts.success("lection set");
    lections = lections;
  }
</script>

<Container>
  <Row class="justify-content-center">
    <Col xs="12" lg="10" xl="8" mx="auto">
      <h2>Lectionary Editor</h2>
    </Col>
  </Row>

  <Row class="justify-content-center">
    <Col xs="12" lg="10" xl="8" mx="auto">
      <strong class="mb-0">Year:</strong>
      <Nav>
        {#each ["A", "B", "C"] as y}
          <NavLink
            href="#/lectionary/{y}/"
            on:click={async () => {
              lections = await loadLections(y);
            }}>{y}</NavLink
          >
        {/each}
      </Nav>
    </Col>
  </Row>

  <Row>
    <Col>
      <div class="my-4">
        <ListGroup class="mb-5 shadow">
          {#each [...lections] as [k, v]}
            <ListGroupItem>
              <Row class="align-items-center">
                <Col xs="12" lg="10" xl="8" mx="auto">
                  {#if editorPerm}
                    <Button
                      on:click={toggleLectionModalOpen}
                      value={k}
                      size="sm">{k}</Button
                    >
                  {:else}
                    <strong class="mb-0">{k}</strong>
                  {/if}
                </Col>
              </Row>
              <Row class="align-items-center">
                <Col xs="1"><strong>M:</strong></Col>
                <Col xs="2">{v.morning}</Col>
                <Col xs="1"><strong>E:</strong></Col>
                <Col xs="2">{v.evening}</Col>
                <Col xs="1"><strong>MP:</strong></Col>
                <Col xs="2">{v.morningpsalm}</Col>
                <Col xs="1"><strong>EP:</strong></Col>
                <Col xs="1">{v.eveningpsalm}</Col>
              </Row>
            </ListGroupItem>
          {/each}
        </ListGroup>
      </div>
    </Col>
  </Row>
</Container>

<Modal
  id="lectionModal"
  isOpen={lectionModalOpen}
  {toggleLectionModalOpen}
  size="xl"
>
  <ModalHeader {toggleLectionModalOpen}>Edit Lection</ModalHeader>
  <ModalBody>
    Morning Psalm: <Input bind:value={modalData.morningpsalm} />
    Morning: <Input bind:value={modalData.morning} />
    Evening Psalm: <Input bind:value={modalData.eveningpsalm} />
    Evening: <Input bind:value={modalData.evening} />
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" size="sm" on:click={toggleLectionModalOpen}>
      Cancel
    </Button>
    <Button color="success" size="sm" on:click={confirmLectionModal}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>
