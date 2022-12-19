<script lang="ts">
  import {
    Container,
    Row,
    Col,
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
  import { db, recordEvent, screenView, getDocsCacheFirst } from "../firebase";
  import proper from "../model/proper";
  import { onMount, getContext } from "svelte";
  import { toasts } from "svelte-toasts";
  import { link } from "svelte-spa-router";
  import lection from "../model/lection";
  import type { Writable } from "svelte/store";
  import type User from "../../types/model/user";

  // @ts-ignore
  export let params = { y };
  $: year = params.y ? params.y : "A";
  const _ll: Map<string, [proper, lection]> = new Map();
  $: lections = _ll;
  let me: Writable<User> = getContext("me");

  class mdClass {
    morning?: string;
    evening?: string;
    morningtitle?: string;
    eveningtitle?: string;
    morningpsalm?: string;
    eveningpsalm?: string;
    season?: string;
    proper?: number;
    weekday?: number;
    key?: string;
    path?: string;
    _morningpsalmref?: string;
    _eveningpsalmref?: string;

    constructor(obj: any) {
      if (obj.morning) this.morning = obj.morning;
      if (obj.evening) this.evening = obj.evening;
      if (obj.morningtitle) this.morningtitle = obj.morningtitle;
      if (obj.eveningtitle) this.eveningtitle = obj.eveningtitle;
      if (obj.morningpsalm) this.morningpsalm = obj.morningpsalm;
      if (obj.eveningpsalm) this.eveningpsalm = obj.eveningpsalm;
      if (obj.season) this.season = obj.season;
      if (obj.proper) this.proper = obj.proper;
      if (obj.weekday) this.weekday = obj.weekday;
      if (obj.key) this.key = obj.key;
      if (obj.path) this.path = obj.path;
      if (obj._morningpsalmref) this._morningpsalmref = obj._morningpsalmref;
      if (obj._eveningpsalmref) this._eveningpsalmref = obj._eveningpsalmref;
    }
  }
  const _md: mdClass = new mdClass({});
  $: modalData = _md;

  async function loadLections(
    y: string
  ): Promise<Map<string, [proper, lection]>> {
    let progressBarString = "starting";
    const progressBar = toasts.success("Loading Data", progressBarString, {
      duration: 0,
    });

    const ay: Map<string, proper> = proper.AllYear(y);
    const out: Map<string, [proper, lection]> = new Map();
    const empty: lection = new lection({});

    let i = 0;
    for (const [k, v] of ay) {
      out.set(k, [v, empty]);
      progressBarString = i.toString();
      progressBar.update({
        title: "Loading data",
        description: progressBarString,
      });
      i = i + 1;

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
          const newLection: lection = new lection(n);
          newLection.path = a.ref.path;
          out.set(k, [v, newLection]);
        }
      } catch (e) {
        toasts.error(e.message);
        console.log(e);
      }
    }
    progressBar.remove();
    return out;
  }

  onMount(async () => {
    lections = await loadLections(year);
    screenView("Lection List");
  });

  let lectionModalOpen = false;
  async function toggleLectionModalOpen(e: Event): Promise<void> {
    screenView("lectionModalOpen");
    lectionModalOpen = !lectionModalOpen;

    // discard the caches, do not copy them here
    if (lectionModalOpen) {
      const t = e.target as HTMLInputElement;
      const [p, l] = lections.get(t.value);
      modalData = new mdClass({
        morning: l.morning,
        evening: l.evening,
        morningpsalm: l.morningpsalm,
        eveningpsalm: l.eveningpsalm,
        morningtitle: l.morningtitle,
        eveningtitle: l.eveningtitle,
        season: p.season,
        proper: p.proper,
        weekday: p.weekday,
        path: p.path,
        key: t.value,
      });
    }
  }

  async function confirmLectionModal(): Promise<void> {
    recordEvent("edit_lection", { key: modalData.key });
    lectionModalOpen = !lectionModalOpen;

    // do not write the cached data back, refetch it
    const data: mdClass = new mdClass({
      morning: modalData.morning,
      morningpsalm: modalData.morningpsalm,
      morningtitle: modalData.morningtitle,
      evening: modalData.evening,
      eveningpsalm: modalData.eveningpsalm,
      eveningtitle: modalData.eveningtitle,
      season: modalData.season,
      proper: modalData.proper,
      weekday: modalData.weekday,
    });

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
    const _p: proper = new proper(modalData);
    const _l: lection = new lection(modalData);
    lections.set(modalData.key, [_p, _l]);
    toasts.success("lection saved");
    lections = lections;
  }
</script>

<svelte:head>
  <title>WADO Lectionary Editor: Year {year}</title>
</svelte:head>

<Container>
  <Row>
    <Col class="mx-auto">
      <h2>Lectionary Editor: Year {year}</h2>
    </Col>
  </Row>

  <Row>
    <Col class="mx-auto">
      <TabContent
        on:tab={async (e) => {
          if (e.detail == year) return;
          lections = new Map();
          year = e.detail;
          document.location.assign("#/lectionary/" + year);
          lections = await loadLections(year);
        }}
      >
        {#each ["A", "B", "C"] as y}
          <TabPane tabId={y} tab="Year {y}" active={year == y} />
        {/each}
      </TabContent>
    </Col>
  </Row>

  <Row>
    <Col class="mx-auto">
      <div class="my-4">
        <ListGroup class="mb-5 shadow">
          {#each [...lections] as [k, v]}
            <ListGroupItem>
              <Row class="align-items-center">
                <Col xs="12" class="mx-auto">
                  {#if $me.isEditor}
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
                {#if v[1]._morningpsalmref}
                  <Col xs="2"
                    ><em class="text-success"
                      ><a
                        href="/edit/{v[1]._morningpsalmref}"
                        target="_blank"
                        use:link
                        rel="noopener noreferrer">{v[1].morningpsalm}</a
                      ></em
                    ></Col
                  >
                {:else}
                  <Col xs="2">{v[1].morningpsalm}</Col>
                {/if}
                <Col xs="1"><strong>Morning:</strong></Col>
                {#if v[1]._morning}
                  <Col xs="2"><em class="text-success">{v[1].morning}</em></Col>
                {:else}
                  <Col xs="2">{v[1].morning}</Col>
                {/if}
                <Col xs="2"><strong>Morning Title:</strong></Col>
                <Col xs="3">{v[1].morningtitle}</Col>
              </Row>
              <Row class="align-items-center">
                <Col xs="2"><strong>Evening Psalm:</strong></Col>
                {#if v[1]._eveningpsalmref}
                  <Col xs="2"
                    ><em class="text-success"
                      ><a
                        href="/edit/{v[1]._eveningpsalmref}"
                        use:link
                        target="_blank"
                        rel="noopener noreferrer">{v[1].eveningpsalm}</a
                      ></em
                    ></Col
                  >
                {:else}
                  <Col xs="2">{v[1].eveningpsalm}</Col>
                {/if}
                <Col xs="1"><strong>Evening:</strong></Col>
                {#if v[1]._evening}
                  <Col xs="2"><em class="text-success">{v[1].evening}</em></Col>
                {:else}
                  <Col xs="2">{v[1].evening}</Col>
                {/if}
                <Col xs="2"><strong>Evening Title:</strong></Col>
                <Col xs="3">{v[1].eveningtitle}</Col>
              </Row>
            </ListGroupItem>
          {/each}
        </ListGroup>
      </div>
    </Col>
  </Row>
</Container>

<Modal id="lectionModal" isOpen={lectionModalOpen} size="xl">
  <ModalHeader>Edit Lection: {modalData.key}</ModalHeader>
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
