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
    TabContent,
    TabPane,
  } from "sveltestrap";
  import {
    collection,
    query,
    where,
    limit,
    doc,
    addDoc,
    setDoc,
    getDocs,
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
    let progressBarString = "starting";
    const progressBar = toasts.success("Loading Data", progressBarString, {
      duration: 0,
    });

    const ay = proper.AllYear(y);

    let i = 0;
    for (const [k, v] of ay) {
      progressBarString = i;
      progressBar.update({
        title: "Loading data",
        description: progressBarString,
      });
      i = i + 1;

      v.morning = "";
      v.evening = "";
      v.morningpsalm = "";
      v.eveningpsalm = "";
      v.morningtitle = "";
      v.eveningtitle = "";

      try {
        const q = query(
          collection(db, "lections", y, "l"),
          where("season", "==", v.season),
          where("weekday", "==", v.weekday),
          where("proper", "==", v.proper),
          limit(1)
        );
        // const res = await getDocsCacheFirst(q);
        const res = await getDocs(q);
        for (const a of res.docs) {
          const n = a.data();
          v.path = a.ref.path;
          v.morning = n.morning;
          v.evening = n.evening;
          v.morningpsalm = n.morningpsalm;
          v.eveningpsalm = n.eveningpsalm;
          if (n.morningtitle) v.morningtitle = n.morningtitle;
          if (n.eveningtitle) v.eveningtitle = n.eveningtitle;

          // get caches if set
          if (n._morning) v._morning = n._morning;
          if (n._evening) v._evening = n._evening;
          if (n._morningpsalm) v._morningpsalm = n._morningpsalm;
          if (n._eveningpsalm) v._eveningpsalm = n._eveningpsalm;
          if (n._morningpsalmref) v._morningpsalmref = n._morningpsalmref;
          if (n._eveningpsalmref) v._eveningpsalmref = n._eveningpsalmref;
          // ay.set(k, v); // update with data from firestore // needed?
        }
      } catch (e) {
        toasts.error(e.message);
        console.log(e);
      }
    }
    progressBar.remove();
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

    // discard the caches, do not copy them here
    if (lectionModalOpen) {
      const v = lections.get(e.target.value);
      modalData = {
        morning: v.morning,
        evening: v.evening,
        morningpsalm: v.morningpsalm,
        eveningpsalm: v.eveningpsalm,
        morningtitle: v.morningtitle,
        eveningtitle: v.eveningtitle,
        season: v.season,
        proper: v.proper,
        weekday: v.weekday,
        path: v.path,
        key: e.target.value,
      };
    }
  }

  async function confirmLectionModal() {
    recordEvent("edit_lection", { key: modalData.key });
    lectionModalOpen = !lectionModalOpen;

    // do not write the cached data back, refetch it
    const data = {
      morning: modalData.morning,
      morningpsalm: modalData.morningpsalm,
      morningtitle: modalData.morningtitle,
      evening: modalData.evening,
      eveningpsalm: modalData.eveningpsalm,
      eveningtitle: modalData.eveningtitle,
      season: modalData.season,
      proper: modalData.proper,
      weekday: modalData.weekday,
    };

    // try to link to the formatted psalms
    try {
      let q = query(
        collection(db, "prayers"),
        where("Class", "==", "psalm"),
        where("Name", "==", modalData.morningpsalm)
      );
      let res = await getDocsCacheFirst(q);
      for (const a of res.docs) {
        data._morningpsalmref = a.id;
      }

      q = query(
        collection(db, "prayers"),
        where("Class", "==", "psalm"),
        where("Name", "==", modalData.eveningpsalm)
      );
      res = await getDocsCacheFirst(q);
      for (const a of res.docs) {
        data._eveningpsalmref = a.id;
      }
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }

    // send to firestore
    try {
      if (modalData.path == "" || typeof modalData.path == "undefined") {
        const added = await addDoc(collection(db, "lections", year, "l"), data);
        modalData.path = added.path;
      } else {
        await setDoc(doc(db, modalData.path), data);
      }
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
    lections.set(modalData.key, modalData);
    toasts.success("lection saved");
    lections = lections;
  }

  function isActive(y) {
    return year == y;
  }

  async function setActive(y) {
    console.log("setActive", y);
    year = y;
    // lections = await loadLections(y);
    document.location.replace("#/lectionary/" + y);
  }
</script>

<Container>
  <Row>
    <Col mx="auto">
      <h2>Lectionary Editor</h2>
    </Col>
  </Row>

  <Row>
    <Col mx="auto">
      <TabContent
        on:click={() => {
          setActive("A");
        }}
      >
        {#each ["A", "B", "C"] as y}
          <TabPane
            tabId={y}
            tab="Year {y}"
            on:click={() => {
              setActive(y);
            }}
            active={isActive(y)}
          />
        {/each}
      </TabContent>
    </Col>
  </Row>

  <Row>
    <Col mx="auto">
      <div class="my-4">
        <ListGroup class="mb-5 shadow">
          {#each [...lections] as [k, v]}
            <ListGroupItem>
              <Row class="align-items-center">
                <Col xs="12" lg="10" xl="8" mx="auto">
                  {#if editorPerm}
                    <Button
                      color="success"
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
                <Col xs="2"><strong>Morning Psalm:</strong></Col>
                {#if v._morningpsalmref}
                  <Col xs="2"
                    ><em class="text-success">{v.morningpsalm}</em></Col
                  >
                {:else if v._morningpsalm}
                  <Col xs="2"
                    ><em class="text-warning">{v.morningpsalm}</em></Col
                  >
                {:else}
                  <Col xs="2">{v.morningpsalm}</Col>
                {/if}
                <Col xs="2"><strong>Morning:</strong></Col>
                {#if v._morning}
                  <Col xs="2"><em class="text-success">{v.morning}</em></Col>
                {:else}
                  <Col xs="2">{v.morning}</Col>
                {/if}
                <Col xs="2"><strong>Morning Title:</strong></Col>
                <Col xs="2">{v.morningtitle}</Col>
              </Row>
              <Row class="align-items-center">
                <Col xs="2"><strong>Evening Psalm:</strong></Col>
                {#if v._eveningpsalmref}
                  <Col xs="2"
                    ><em class="text-success">{v.eveningpsalm}</em></Col
                  >
                {:else if v._eveningpsalm}
                  <Col xs="2"
                    ><em class="text-warning">{v.eveningpsalm}</em></Col
                  >
                {:else}
                  <Col xs="2">{v.eveningpsalm}</Col>
                {/if}
                <Col xs="2"><strong>Evening:</strong></Col>
                {#if v._evening}
                  <Col xs="2"><em class="text-success">{v.evening}</em></Col>
                {:else}
                  <Col xs="2">{v.evening}</Col>
                {/if}
                <Col xs="2"><strong>Evening Title:</strong></Col>
                <Col xs="2">{v.eveningtitle}</Col>
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
    M Psalm: <Input bind:value={modalData.morningpsalm} />
    M: <Input bind:value={modalData.morning} />
    M Title: <Input bind:value={modalData.morningtitle} />
    E Psalm: <Input bind:value={modalData.eveningpsalm} />
    E: <Input bind:value={modalData.evening} />
    E Title: <Input bind:value={modalData.eveningtitle} />
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
