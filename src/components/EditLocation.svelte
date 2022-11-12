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
  } from "sveltestrap";
  import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    deleteDoc,
  } from "firebase/firestore";
  import { db, recordEvent } from "../firebase";
  import association from "../model/association";
  import prayer from "../model/prayer";
  import { onMount } from "svelte";
  import { toasts } from "svelte-toasts";

  export let params = { id };
  const id = params.id ? params.id : "GENERAL-ANYTHING";
  $: associations = new Map();
  let editorPerm = false;
  let modalId = "exnihilo";

  let deleteModalOpen = false;
  function toggleDeleteOpen(e) {
    recordEvent("screen_view", { firebase_screen: "edit: toggleDeleteOpen" });
    deleteModalOpen = !deleteModalOpen;
    if (deleteModalOpen) modalId = e.target.value;
  }

  async function confirmDelete(e) {
    recordEvent("delete_assoc", { id: id, assoc: e.target.value });
    console.debug("deleting association", e.target.value);
    deleteModalOpen = !deleteModalOpen;

    try {
      await deleteDoc(doc(db, "associations", e.target.value));
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
    const newAssn = new Array();
    for (const a of associations) {
      if (a.id != e.target.value) {
        newAssn.push(a);
      }
    }
    associations = newAssn;
    toasts.success("Association deleted", e.target.value);
  }

  async function loadLocation() {
    const newAssn = new Map();
    try {
      const q = query(
        collection(db, "associations"),
        where("Location", "==", id)
      );
      const res = await getDocs(q);
      for (const a of res.docs) {
        const n = new association(a);

        if (!n.Reference || n.Reference == "FIXME") {
          console.error("bad reference, deleting association");
          deleteDoc(doc(db, "associations", n.id)); // no need to await here
          toasts.info("Deleting Invalid Association", n.id);
          continue;
        }

        const rawprayer = await getDoc(n.Reference);
        if (!rawprayer || !rawprayer.exists()) {
          console.error("bad reference, deleting association");
          deleteDoc(doc(db, "associations", n.id)); // no need to await here
          toasts.info("Deleting Invalid Association", n.id);
          continue;
        }
        const pp = new prayer(rawprayer.data());
        n._PrayerName = pp.name;
        newAssn.set(a.id, n);
      }

      // now that the full list is built, sort it
      associations = new Map([...newAssn].sort(association.sort));
    } catch (error) {
      console.log(error);
    }
  }

  onMount(async () => {
    recordEvent("screen_view", { firebase_screen: "EditLocation", id: id });
    await loadLocation();
  });
</script>

<Container>
  <Row>
    <Col>
      <Card>
        <CardHeader>Associations for {id}</CardHeader>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>Prayer</th>
                <th>Calendar Date</th>
                <th>Season</th>
                <th>Proper</th>
                <th>Weekday</th>
                <th>Lectionary Year</th>
                <th>Weight</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {#each [...associations] as [k, v]}
                <tr id={k}>
                  <td>
                    <a href="#/edit/{v.Reference.id}">
                      {v._PrayerName}
                    </a>
                  </td>
                  <td>{v.CalendarDate}</td>
                  <td>{v.Season}</td>
                  <td>{v.ProperDisplay}</td>
                  <td>{v.WeekdayDisplay}</td>
                  <td>{v.Year}</td>
                  <td>{v.Weight}</td>
                  <td>
                    <Button
                      on:click={toggleDeleteOpen}
                      value={k}
                      color="warning"
                    >
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
  <ModalHeader {toggleDeleteOpen}>Delete Association</ModalHeader>
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
