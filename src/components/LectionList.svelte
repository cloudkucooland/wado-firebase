<script>
  import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Nav,
    NavLink,
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
    getCountFromServer,
  } from "firebase/firestore";
  import { db, recordEvent, isEditor, screenView } from "../firebase";
  import association from "../model/association";
  import prayer from "../model/prayer";
  import { onMount } from "svelte";
  import { toasts } from "svelte-toasts";

  export let params = { l, y };
  $: location = params.l ? params.l : "LAUDS-LECTIONARY";
  $: year = params.y ? params.y : "A";
  $: lections = new Map();
  let editorPerm = false;
  let modalId = "exnihilo";

  const ls = new Array(
    "LAUDS-LECTIONARY",
    "LAUDS-LECTIONARY2",
    "LAUDS-LECTIONARY-HEARWHATSAYING",
    "VESPER-LECTIONARY"
  );

  async function loadLocations(loc, y) {
    console.log("loadLocations", loc, y);
    const m = new Map();
    try {
      const q = query(
        collection(db, "associations"),
        where("Location", "==", loc),
        where("Year", "==", y)
      );
      const res = await getDocs(q);
      for (const a of res.docs) {
        const p = new association(a);

        m.set(a.id, p);
      }
    } catch (e) {
      console.log(e);
    }
    return m;
  }

  onMount(async () => {
    lections = await loadLocations(location, year);
    screenView("Lection List");
    editorPerm = await isEditor();
  });
</script>

<Container>
  <Nav>
    {#each ls as lx}
      {#each ["A", "B", "C"] as y}
        <NavLink
          href="#/lectionary/{lx}/{y}/"
          on:click={async () => {
            lections = await loadLocations(lx, y);
          }}>{lx} {y}</NavLink
        >
      {/each}
    {/each}
  </Nav>
  <Row>
    <Col>
      <Card>
        <CardHeader>{location}: Year {year}</CardHeader>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>Passage</th>
                <th>Season</th>
                <th>Proper</th>
                <th>Weekday</th>
              </tr>
            </thead>
            <tbody>
              {#each [...lections] as [k, v]}
                <tr id={k}>
                  <td>
                    <a href="#/edit/{v.Reference.id}">
                      {v.Reference.id}
                    </a>
                  </td>
                  <td>{v.Season}</td>
                  <td>{v.Proper}</td>
                  <td>{v.Weekday}</td>
                </tr>
              {/each}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
