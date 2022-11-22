<script>
  import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Table,
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
    lections = ay;
    console.log(lections);
  }

  onMount(async () => {
    lections = await loadLections(year);
    screenView("Lection List");
    editorPerm = await isEditor();
  });
</script>

<Container>
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
  <Row>
    <Col>
      <Card>
        <CardHeader>Year {year}</CardHeader>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Season</th>
                <th>Proper</th>
                <th>Weekday</th>
              </tr>
            </thead>
            <tbody>
              {#each [...lections] as [k, v]}
                <tr id={k}>
                  <td>{k}</td>
                  <td>{v.season}</td>
                  <td>{v.proper}</td>
                  <td>{v.weekday}</td>
                </tr>
              {/each}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
