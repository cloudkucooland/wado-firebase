<script>
  import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Form,
    FormGroup,
    Input,
    Label,
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
    addDoc,
    setDoc,
    deleteDoc,
  } from "firebase/firestore";
  import { db, isEditor, auth, recordEvent, screenView } from "../firebase";
  import { locations, seasons, classes, getClass } from "../util";
  import { toasts } from "svelte-toasts";
  import { onMount } from "svelte";
  import EditMedia from "./EditMedia.svelte";
  import EditAssoc from "./EditAssoc.svelte";

  import CKEditor from "ckeditor5-svelte";
  import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor";
  // import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';

  const editor = DecoupledEditor;
  const editorConfig = {
    // plugins: [ SourceEditing ],
    toolbar: {
      items: [
        "bold",
        "italic",
        "underline",
        "|",
        "outdent",
        "indent",
        "|",
        "undo",
        "redo",
      ],
    },
  };
  // "sourceEditing",

  import association from "../model/association";
  import prayer from "../model/prayer";

  export let params = { id };
  const id = params.id ? params.id : "exnihilo";
  let modalId = "";
  let assocEditResult;
  let assocAddResult;
  const size = "xl";
  let editorPerm = false;
  $: prayerData = new prayer({ name: "Loading", body: "Loading" });
  $: associations = new Array();

  let deleteModalOpen = false;
  function toggleDeleteOpen(e) {
    screenView("toggleDeleteOpen");
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
  async function toggleEditOpen(e) {
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
      const newAssn = new Array();
      for (const a of associations) {
        if (a.id != e.target.value) {
          newAssn.push(a);
        }
      }
      newAssn.push(assocEditResult);
      associations = newAssn;
      toasts.success("Saved Association", e.target.value);
    } catch (error) {
      console.log(error);
      toasts.error(error.Message);
    }
  }

  let addAssocModalOpen = false;
  async function toggleAddAssocOpen(e) {
    screenView("toggleAddAssocOpen");
    addAssocModalOpen = !addAssocModalOpen;

    if (addAssocModalOpen) {
      modalId = e.target.value;
    }
  }

  async function confirmAddAssoc(e) {
    recordEvent("edit_assoc", { id: id, assoc: e.target.value });
    addAssocModalOpen = !addAssocModalOpen;

    console.log("add result", assocAddResult.toFirebase());

    try {
      const added = await addDoc(
        collection(db, "associations"),
        assocAddResult.toFirebase()
      );
      const refetched = await getDoc(added);
      // https://svelte.dev/tutorial/updating-arrays-and-objects
      associations = [...associations, new association(refetched)];
      recordEvent("add_assoc", { id: id, new: added.id });
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }

  async function loadPrayer() {
    const ref = doc(db, "prayers/" + id);

    try {
      const toEdit = await getDoc(ref);
      const d = toEdit.data();

      const c = getClass(d.Class);
      if (!c || typeof c == "undefined") console.log(d.Class);
      prayerData = new c(d);

      const q = query(
        collection(db, "associations"),
        where("Reference", "==", ref)
      );
      const res = await getDocs(q);
      for (const a of res.docs) {
        // https://svelte.dev/tutorial/updating-arrays-and-objects
        associations = [...associations, new association(a)];
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function saveChanges() {
    recordEvent("save_prayer", { id: id });

    try {
      await setDoc(doc(db, "prayers", id), prayerData.toFirebase());
      toasts.success("Saved Prayer", id);
    } catch (err) {
      console.error(err);
      toasts.error(err.message);
    }
  }

  function onReady({ detail: editor }) {
    // Insert the toolbar before the editable area.
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    // console.debug(Array.from( editor.ui.componentFactory.names() ));
    // console.debug(editor.config._config, Array.from(editor.config.names()));
    // console.debug(editor._availablePlugins.get("ShiftEnter"), editor._plugins.get("ShiftEnter"), editor._plugins.get("ShiftEnter").isEnabled);
    // editor.plugins.get('ShiftEnter').isEnabled = true;
  }

  onMount(async () => {
    screenView("Edit Prayer");
    await loadPrayer();
    editorPerm = await isEditor();
  });
</script>

<svelte:head>
  <title>Editing: {prayerData.name}</title>
</svelte:head>

<Container>
  <Row>
    <Col>
      <Card class="mb-2">
        {#if editorPerm}
          <CardHeader>Editing: {prayerData.name}</CardHeader>
        {:else}
          <CardHeader>Displaying: {prayerData.name}</CardHeader>
        {/if}
        <CardBody>
          <Container>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    name="name"
                    id="name"
                    bind:value={prayerData.name}
                    disabled={!editorPerm}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <CKEditor
                  {editor}
                  on:ready={onReady}
                  config={editorConfig}
                  bind:value={prayerData.body}
                />
              </Col>
            </Row>
            {#if prayerData.class == "hymn"}
              <Row>
                <Col sm="6">
                  <FormGroup>
                    <Label for="hymntune">Hymn Tune</Label>
                    <Input
                      name="hymntune"
                      id="hymntune"
                      bind:value={prayerData.hymntune}
                      disabled={!editorPerm}
                    />
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="hymnmeter">Meter</Label>
                    <Input
                      name="hymnmeter"
                      id="hymnmeter"
                      bind:value={prayerData.hymnmeter}
                      disabled={!editorPerm}
                    />
                  </FormGroup>
                </Col>
              </Row>
            {/if}
            {#if prayerData.class == "psalm"}
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="psalmrubric">Psalm Rubric</Label>
                    <Input
                      name="psalmrubric"
                      id="psalmrubric"
                      bind:value={prayerData.rubric}
                      disabled={!editorPerm}
                    />
                  </FormGroup>
                </Col>
              </Row>
            {/if}
            <Row>
              <Col sm="3">
                <FormGroup>
                  <Label for="class">Class</Label>
                  <Input
                    type="select"
                    name="class"
                    id="class"
                    bind:value={prayerData.class}
                    disabled={!editorPerm}
                  >
                    {#each [...classes] as [key, value]}
                      <option value={key}>{key}</option>
                    {/each}
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label for="author">Author</Label>
                  <Input
                    name="author"
                    id="author"
                    bind:value={prayerData.author}
                    disabled={!editorPerm}
                  />
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label for="lastEditor">Last Editor</Label>
                  <Input
                    name="lastEditor"
                    disabled="true"
                    id="lastEditor"
                    bind:value={prayerData.lastEditor}
                  />
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label for="lastEdited" type="date">Last Edited</Label>
                  <Input
                    name="lastEdited"
                    disabled="true"
                    id="lastEdited"
                    bind:value={prayerData.lastEdited}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="2">
                <FormGroup>
                  <Label for="license">License</Label>
                  <Input
                    type="checkbox"
                    name="license"
                    id="license"
                    bind:checked={prayerData.license}
                    disabled={!editorPerm}
                  />
                </FormGroup>
              </Col>
              <Col sm="2">
                <FormGroup>
                  <Label for="reviewed">Reviewed</Label>
                  <Input
                    type="checkbox"
                    name="reviewed"
                    id="reviewed"
                    bind:checked={prayerData.reviewed}
                    disabled={!editorPerm}
                  />
                </FormGroup>
              </Col>
              <Col sm="7">&nbsp;</Col>
              <Col sm="1">
                {#if editorPerm}
                  <Button size="sm" color="primary" on:click={saveChanges}>
                    Save
                  </Button>
                {/if}
              </Col>
            </Row>
            <EditMedia {id} media={prayerData.media} />
          </Container>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Associations</CardHeader>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>Location</th>
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
              {#each associations as v}
                <tr id={v.id} class={v.dirtyStyle}>
                  <td>
                    <a href="#/editlocation/{v.Location}">{v.Location}</a>
                  </td>
                  <td>{v.CalendarDate}</td>
                  <td>{v.Season}</td>
                  <td>{v.ProperDisplay}</td>
                  <td>{v.WeekdayDisplay}</td>
                  <td>{v.Year}</td>
                  <td>{v.Weight}</td>
                  <td>
                    {#if editorPerm}
                      <Button
                        size="sm"
                        color="warning"
                        on:click={toggleEditOpen}
                        value={v.id}>Edit</Button
                      >
                      <Button
                        size="sm"
                        color="danger"
                        on:click={toggleDeleteOpen}
                        value={v.id}>delete</Button
                      >
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </Table>
          {#if editorPerm}
            <Button size="sm" color="success" on:click={toggleAddAssocOpen}
              >Add</Button
            >
          {/if}
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
<Modal
  id="addAssocModal"
  isOpen={addAssocModalOpen}
  {toggleAddAssocOpen}
  {size}
>
  <ModalHeader {toggleAddAssocOpen}>Add Association</ModalHeader>
  <ModalBody>
    <EditAssoc id={modalId} bind:result={assocAddResult} addToID={id} />
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

<style>
  tr.dirty {
    background-color: yellow !important;
  }
  tr.clean {
  }
</style>
