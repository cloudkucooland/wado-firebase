<script>
  import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
  } from "sveltestrap";
  import {
    collection,
    query,
    where,
    doc,
    getDoc,
    getDocs,
    deleteDoc,
    setDoc,
    addDoc,
  } from "firebase/firestore";
  import {
    db,
    recordEvent,
    screenView,
    getDocsCacheFirst,
    getDocCacheFirst,
  } from "../firebase";
  import association from "../model/association";
  import prayer from "../model/prayer";
  import { onMount } from "svelte";
  import { toasts } from "svelte-toasts";
  import EditAssoc from "./EditAssoc.svelte";
  import AddAssoc from "./AddAssoc.svelte";

  export let params = { id };
  $: id = params.id ? params.id : "Any";
  $: associations = new Map();
  let modalId = "exnihilo";
  let assocEditResult;
  let assocAddResult;
  const size = "xl";

  let deleteModalOpen = false;
  function toggleDeleteOpen(e) {
    screenView("edit: toggleDeleteOpen");
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

  let editModalOpen = false;
  function toggleEditOpen(e) {
    screenView("toggleEditOpen");
    editModalOpen = !editModalOpen;
    if (editModalOpen) {
      modalId = e.target.value;
    }
  }

  async function confirmEdit(e) {
    recordEvent("edit_assoc", { id: id, assoc: e.target.value });
    editModalOpen = !editModalOpen;

    console.log("edit result", assocEditResult);
    try {
      await setDoc(
        doc(db, "associations", e.target.value),
        assocEditResult.toFirebase()
      );

      const newAssn = new Map();
      for (const [k, v] of associations) {
        if (k != e.target.value) {
          newAssn.set(k, v);
        }
      }

      const rawprayer = await getDocCacheFirst(assocEditResult.Reference);
      const pp = new prayer(rawprayer.data());
      assocEditResult._PrayerName = pp.name;
      newAssn.set(e.target.value, assocEditResult);

      associations = new Map([...newAssn].sort(association.sort));
      toasts.success("Saved Association", e.target.value);
    } catch (error) {
      console.log(error);
      toasts.error(error.Message);
    }
  }

  let addModalAssocOpen = false;
  function toggleAddAssocOpen(e) {
    screenView("toggleAddAssocOpen");
    addModalAssocOpen = !addModalAssocOpen;
    if (addModalAssocOpen) {
      modalId = e.target.value;
    }
  }

  async function confirmAddAssoc(e) {
    addModalAssocOpen = !addModalAssocOpen;

    try {
      await addDoc(collection(db, "associations"), assocAddResult.toFirebase());
      loadLocation(id); // lazy but does the job -- redo if assocs get HUGE
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }

  async function loadLocation(id) {
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
    screenView("EditLocation");
    await loadLocation(id);
  });
</script>

<svelte:head>
  <title>Edit Location: {id}</title>
</svelte:head>

<Container>
  <Row>
    <Col>
      <Form>
        <FormGroup>
          <Label for="locations">Location</Label>
          <Input
            type="select"
            name="locations"
            on:change={(e) => {
              id = e.target.value;
              document.location.assign("#/editlocation/" + e.target.value);
              loadLocation(e.target.value);
            }}
          >
            <option>Any</option>
            {#each association.locations as L}
              <option>{L}</option>
            {/each}
          </Input>
        </FormGroup>
      </Form>
    </Col>
  </Row>
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
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {#each [...associations] as [k, v]}
                <tr id={k} class={v.dirtyStyle}>
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
                    <Button on:click={toggleEditOpen} value={k} color="warning">
                      Edit
                    </Button>
                  </td>
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
        <CardFooter>
          <Button size="sm" color="success" on:click={toggleAddAssocOpen}
            >Add</Button
          >
        </CardFooter>
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
<Modal id="editModal" isOpen={editModalOpen} {toggleEditOpen} {size}>
  <ModalHeader {toggleEditOpen}>Edit Association</ModalHeader>
  <ModalBody>
    <EditAssoc id={modalId} bind:result={assocEditResult} />
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" size="sm" on:click={toggleEditOpen}>
      Cancel
    </Button>
    <Button color="success" size="sm" on:click={confirmEdit} value={modalId}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>
<Modal id="addAssoc" isOpen={addModalAssocOpen} {toggleAddAssocOpen} {size}>
  <ModalHeader {toggleAddAssocOpen}>Add Association</ModalHeader>
  <ModalBody>
    <AddAssoc id={modalId} bind:result={assocAddResult} location={id} />
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" size="sm" on:click={toggleAddAssocOpen}>
      Cancel
    </Button>
    <Button
      color="success"
      size="sm"
      on:click={confirmAddAssoc}
      value={modalId}
    >
      Confirm
    </Button>
  </ModalFooter>
</Modal>
