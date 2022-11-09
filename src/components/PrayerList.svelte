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
    Nav, NavLink
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
  import { db, recordEvent } from "../firebase";
  import association from "../model/association";
  import prayer from "../model/prayer";
  import { onMount } from "svelte";
  import { toasts } from "svelte-toasts";

  export let params = { c };
  const c = params.c? params.c: "prayer";
  $: prayers = new Map();
  let editorPerm = false;
  let modalId = "exnihilo";

  const cs = new Array("prayer", "hymn", "psalm");

  let deleteModalOpen = false;
  function toggleDeleteOpen(e) {
    recordEvent("screen_view", { firebase_screen: "edit: toggleDeleteOpen" });
    deleteModalOpen = !deleteModalOpen;
    if (deleteModalOpen) modalId = e.target.value;
  }

  async function confirmDelete(e) {
    recordEvent("delete_prayer", { id: e.target.value });
    console.debug("deleting prayer", e.target.value);
    deleteModalOpen = !deleteModalOpen;

    try {
      await deleteDoc(doc(db, "prayers", e.target.value));
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
    const newPrayers= new Array();
    for (const p of prayers) {
      if (p.id != e.target.value) {
        newPrayers.push(p);
      }
    }
    prayers = newPrayers;
    toasts.success("Prayer deleted", e.target.value);
  }

  // https://github.com/firebase/snippets-web/blob/36740fb2c39383621c0c0a948236e9eab8a71516/snippets/firestore-next/test-firestore/paginate.js#L8-L23
  async function loadClass() {
    try {
      const q = query(
        collection(db, "prayers"),
        where("Class", "==", c),
        orderBy("Name")
      );
      const res = await getDocs(q);
      for (const a of res.docs) {
        const p = new prayer(a.data());

        const assq = query(collection(db, "associations"), where("Reference", "==", doc(db, "prayers", a.id)));
        const snap = await getCountFromServer(assq);
        p._assCount = snap.data().count;

        // cleanup the prayers & assn here

        prayers.set(a.id, p);
      }

      prayers = prayers;
    } catch (e) {
      console.log(e);
    }
  }

  onMount(async () => {
    recordEvent("screen_view", { firebase_screen: "PrayerList", id: c });
    await loadClass();
    // editorPerm = await isEditor();
  });
</script>

<Container>
  <Nav>
    {#each cs as cx}
      <NavLink href="#/prayers/{cx}/">{cx}</NavLink>
    {/each}
  </Nav>
<p>Loading might take a bit... be patient until I can make it better</p>
  <Row>
    <Col>
      <Card>
        <CardHeader>{c}</CardHeader>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>Prayer</th>
                <th>Licensed</th>
                <th>Reviewed</th>
                <th>Associations</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {#each [...prayers] as [k, v]}
                <tr id={k}>
                  <td>
                    <a href="#/edit/{k}">
                      {v.name}
                    </a>
                  </td>
                  <td>{v.license}</td>
                  <td>{v.reviewed}</td>
                  <td>{v._assCount}</td>
                  <td>
                    <Button on:click={toggleDeleteOpen} value={k} color="warning">
                      Delete
                    </Button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
<Modal
  id="deleteModal"
  isOpen={deleteModalOpen}
  backdrop="static"
  {toggleDeleteOpen}
>
  <ModalHeader {toggleDeleteOpen}>Delete Prayer</ModalHeader>
  <ModalBody>Confirm Delete</ModalBody>
  <ModalFooter>
    <Button color="primary" size="sm" on:click={toggleDeleteOpen}>
      Cancel
    </Button>
    <Button color="warning" size="sm" on:click={confirmDelete} value={modalId}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>

