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
  import { db, isEditor, auth, recordEvent } from "../firebase";
  import { locations, seasons, classes, getClass } from "../util";
  import { toasts } from "svelte-toasts";
  import { onMount } from "svelte";

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
  let editorPerm = false;
  $: prayerData = new prayer({ name: "Loading", body: "Loading" });
  $: associations = new Array();

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

    if (associations.length <= 1) {
      toasts.error("Cannot delete last association, edit to UNSET");
      return;
    }

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
    recordEvent("screen_view", { firebase_screen: "edit: toggleEditOpen" });
    editModalOpen = !editModalOpen;
    if (editModalOpen) {
      modalId = this.target.value;

      /* const ref = doc(db, "associations/" + e.target.value);
      const d = docGet(ref);
      const a = new association(d);
      console.log(a); */
      const modal = document.getElementById("editModalBody");
      modal.textContent = "draw menus here";
    }
  }

  function confirmEdit(e) {
    recordEvent("edit_assoc", { id: id, assoc: e.target.value });
    console.log(e);
    editModalOpen = !editModalOpen;
    // write new data to firebase
    // update display?
  }

  async function addAssoc(e) {
    try {
      const building = new association({
        id: "unset",
        data: () => {
          return {
            Reference: doc(db, "prayers/" + id),
            Location: document.getElementById("addLocation").value,
            CalendarDate: document.getElementById("addCalendarDate").value,
            Season: document.getElementById("addSeason").value,
            Proper: +document.getElementById("addProper").value,
            Weekday: +document.getElementById("addWeekday").value,
            Year: document.getElementById("addYear").value,
            Weight: +document.getElementById("addWeight").value,
          };
        },
      });
      const added = await addDoc(
        collection(db, "associations"),
        building.toFirebase()
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
    const editedData = {
      Name: document.getElementById("name").value,
      Class: document.getElementById("class").value,
      Body: prayerData.body,
      License: document.getElementById("license").checked,
      Reviewed: document.getElementById("reviewed").checked,
      "Last Editor": auth.currentUser.displayName,
      "Last Edited": new Date().toUTCString(),
      Author: document.getElementById("author").value,
    };

    // currently displayed
    if (prayerData.class == "hymn") {
      editedData["Hymn Tune"] = document.getElementById("hymntune").value;
      editedData["Hymn Meter"] = document.getElementById("hymnmeter").value;
    }

    if (prayerData.class == "psalm") {
      editedData.Antiphon = document.getElementById("psalmrubric").value;
    }

    // convert to class type, then back to store, for cleanup
    const c = getClass(editedData.Class);
    const n = new c(editedData);

    try {
      await setDoc(doc(db, "prayers", id), n.toFirebase());
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
    recordEvent("screen_view", { firebase_screen: "Edit", id: id });
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
                    value={prayerData.name}
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
                      value={prayerData.hymntune}
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
                      value={prayerData.hymnmeter}
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
                    <Label for="psalmrubric">Hymn Tune</Label>
                    <Input
                      name="psalmrubric"
                      id="psalmrubric"
                      value={prayerData.rubric}
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
                    value={prayerData.class}
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
                    value={prayerData.author}
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
                    value={prayerData.lastEditor}
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
                    value={prayerData.lastEdited}
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
                    checked={prayerData.license}
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
                    checked={prayerData.reviewed}
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
                <tr id={v.id}>
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
              {#if editorPerm}
                <tr>
                  <td>
                    <Input type="select" id="addLocation">
                      {#each locations as l}
                        <option value={l}>{l}</option>
                      {/each}
                    </Input>
                  </td>
                  <td>
                    <Input
                      id="addCalendarDate"
                      value="Any"
                      placeholder="mm-dd"
                    />
                  </td>
                  <td>
                    <Input type="select" id="addSeason" value="Any">
                      <option value="Any">Any</option>
                      {#each seasons as s}
                        <option value={s}>{s}</option>
                      {/each}
                    </Input>
                  </td>
                  <td><Input id="addProper" value="Any" /></td>
                  <td>
                    <Input type="select" id="addWeekday" value="-1">
                      <option value="-1">Any</option>
                      <option value="0">Sunday</option>
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thursday</option>
                      <option value="5">Friday</option>
                      <option value="6">Saturday</option>
                    </Input>
                  </td>
                  <td>
                    <Input id="addYear" type="select" value="Any">
                      <option value="Any">Any</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </Input>
                  </td>
                  <td><Input id="addWeight" value="1" /></td>
                  <td>
                    <Button size="sm" color="success" on:click={addAssoc}>
                      Add
                    </Button>
                  </td>
                </tr>
              {/if}
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
<Modal id="editModal" isOpen={editModalOpen} backdrop="static" {toggleEditOpen}>
  <ModalHeader {toggleEditOpen}>Edit Association</ModalHeader>
  <ModalBody id="editModalBody">Edit stuff goes here....</ModalBody>
  <ModalFooter>
    <Button color="secondary" size="sm" on:click={toggleEditOpen}>Cancel</Button
    >
    <Button color="success" size="sm" on:click={confirmEdit} value={modalId}
      >Confirm</Button
    >
  </ModalFooter>
</Modal>
