<script>
  import {
    Container,
    Row,
    Col,
    Nav,
    NavLink,
    ListGroup,
    ListGroupItem,
  } from "sveltestrap";
  import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    deleteDoc,
    orderBy,
  } from "firebase/firestore";
  import { db, recordEvent, isEditor, screenView } from "../firebase";
  // import association from "../model/association";
  // import prayer from "../model/prayer";
  import season from "../model/season";
  import proper from "../model/proper";
  import { onMount } from "svelte";
  import { toasts } from "svelte-toasts";

  export let params; //  = { y };
  $: year = params.y ? params.y : "A";
  $: lections = new Map();
  let editorPerm = false;
  let modalId = "exnihilo";

  async function loadLections(y) {
    const ay = proper.AllYear(y);
    for (const [k, v] of ay) {
      /* try {
      const q = query(collection(db, "lections", y, "l"));
      const res = await getDocs(q);
      for (const a of res.docs) {
        fromFS.set(a.id, a.data()); // convert to some class
      }
    } catch (e) {
      console.log(e);
    } */
    }
    return ay;
  }

  onMount(async () => {
    lections = await loadLections(year);
    screenView("Lection List");
    editorPerm = await isEditor();
  });
</script>

<Container>
  <Row class="justify-content-center">
    <Col xs="12" lg="10" xl="8" mx="auto">
      <h2>Lectionary Editor</h2>
    </Col>
  </Row>

  <Row class="justify-content-center">
    <Col xs="12" lg="10" xl="8" mx="auto">
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
                  <strong class="mb-0">{k}</strong>
                </Col>
              </Row>
              <Row class="align-items-center">
                <Col xs="1"><strong>M</strong></Col>
                <Col xs="2">Morning</Col>
                <Col xs="1"><strong>E</strong></Col>
                <Col xs="2">Evening</Col>
                <Col xs="1"><strong>P</strong></Col>
                <Col xs="2">Psalm</Col>
                <Col xs="1"><strong>A</strong></Col>
                <Col xs="1">Antiphon</Col>
              </Row>
            </ListGroupItem>
          {/each}
        </ListGroup>
      </div>
    </Col>
  </Row>
</Container>
