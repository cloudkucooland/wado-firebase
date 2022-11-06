<script>
  import {
    Spinner,
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
    Icon,
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
  } from "firebase/firestore";
  import { db, isEditor } from "../firebase";
  import { locations, seasons } from "../util";

  import CKEditor from "ckeditor5-svelte";
  import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor";
  let editor = DecoupledEditor;
  let editorConfig = {
    toolbar: {
      items: ["bold", "italic", "underline"],
    },
  };

  import prayer from "../model/prayer";
  import psalm from "../model/psalm";
  import hymn from "../model/hymn";
  import lection from "../model/lection";
  import heartword from "../model/heartword";
  import association from "../model/association";

  export let params = { id };
  const id = params.id ? params.id : "exnihilo";
  let editorPerm = false;
  let modelData;

  const classes = new Map([
    ["prayer", prayer],
    ["psalm", psalm],
    ["hymn", hymn],
    ["lection", lection],
    ["heartword", heartword],
  ]);

  let deleteModalOpen = false;
  function toggleDeleteOpen(e) {
    console.log(e);
    deleteModalOpen = !deleteModalOpen;
  }

  function confirmDelete(e) {
    console.log(e);
    deleteModalOpen = !deleteModalOpen;
    // check to make sure not last assn
    // remove it from firebase
  }

  let editModalOpen = false;
  async function toggleEditOpen(e) {
    editModalOpen = !editModalOpen;
    if (editModalOpen) {
      const ref = doc(db, "associations/" + e.target.value);
      const d = await getDoc(ref);
      const a = new association(d);
      console.log(a);
      const modal = document.getElementById("editModalBody");
      modal.textContent = a;
    }
  }

  function confirmEdit(e) {
    console.log(e);
    editModalOpen = !editModalOpen;
    // write new data to firebase
    // update display?
  }

  async function addAssoc(e) {
    console.log(e);
  }

  async function loadPrayer() {
    editorPerm = await isEditor();

    const ref = doc(db, "prayers/" + id);

    try {
      const toEdit = await getDoc(ref);
      const d = toEdit.data();

      const c = classes.get(d.Class);
      modelData = new c(d);
      modelData.associations = new Map();

      const q = query(
        collection(db, "associations"),
        where("Reference", "==", ref)
      );
      const res = await getDocs(q);
      for (const a of res.docs) {
        const n = new association(a);
        modelData.associations.set(a.id, n);
      }

      return modelData;
    } catch (e) {
      console.log(e);
    }
    return {};
  }

  function saveChanges(e) {
    console.log(e);
  }

  function onReady({ detail: editor }) {
    // Insert the toolbar before the editable area.
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }
</script>

{#await loadPrayer()}
  <Spinner color="primary" />
{:then data}
  <Container>
    <Row>
      <Col>
        <Card class="mb-2">
          {#if editorPerm == true}
            <CardHeader>Editing: {data.name}</CardHeader>
          {:else}
            <CardHeader>Displaying: {data.name}</CardHeader>
          {/if}
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="class">Class</Label>
                <Input type="select" name="class" id="class" value={data.class}>
                  {#each [...classes] as [key, value]}
                    <option value={key}>{key}</option>
                  {/each}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input name="name" id="name" value={data.name} />
              </FormGroup>
              <CKEditor
                {editor}
                on:ready={onReady}
                config={editorConfig}
                value={data.body}
              />
              {#if data.class == "hymn"}
                <FormGroup>
                  <Label for="tune">Hymn Tune</Label>
                  <Input name="tune" id="tune" value={data.hymntune} />
                </FormGroup>
                <FormGroup>
                  <Label for="meter">Meter</Label>
                  <Input name="meter" id="meter" value={data.hymnmeter} />
                </FormGroup>
              {/if}
              {#if data.class == "prayer" || data.class == "heartword"}
                <FormGroup>
                  <Label for="author">Author</Label>
                  <Input name="author" id="author" value={data.author} />
                </FormGroup>
              {/if}
              <FormGroup>
                <Label for="editor">Last Editor</Label>
                <Input
                  name="editor"
                  disabled="true"
                  id="editor"
                  value={data.lastEditor}
                />
              </FormGroup>
              <FormGroup>
                <Label for="edited" type="date">Last Edited</Label>
                <Input
                  name="edited"
                  disabled="true"
                  id="edited"
                  value={data.lastEdited}
                />
              </FormGroup>
              <FormGroup>
                <Label for="license">License</Label>
                <Input
                  type="checkbox"
                  name="license"
                  id="license"
                  checked={data.license}
                />
              </FormGroup>
              <FormGroup>
                <Label for="reviewed">Reviewed</Label>
                <Input
                  type="checkbox"
                  name="reviewed"
                  id="reviewed"
                  checked={data.license}
                />
              </FormGroup>
            </Form>
            <Button size="sm" color="primary" on:click={saveChanges}>
              Save
            </Button>
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
                {#each [...data.associations] as [k, v]}
                  <tr id={k}>
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
                      <Button
                        size="sm"
                        color="warning"
                        on:click={toggleEditOpen}
                        value={k}>Edit</Button
                      >
                      <Button
                        size="sm"
                        color="danger"
                        on:click={toggleDeleteOpen}
                        value={k}>delete</Button
                      >
                    </td>
                  </tr>
                {/each}
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
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
{:catch e}
  <div>{e}</div>
{/await}
<Modal
  id="deleteModal"
  isOpen={deleteModalOpen}
  backdrop="static"
  {toggleDeleteOpen}
>
  <ModalHeader {toggleDeleteOpen}>Delete Association</ModalHeader>
  <ModalBody>Confirm Delete</ModalBody>
  <ModalFooter>
    <Button color="primary" size="sm" on:click={toggleDeleteOpen}>Cancel</Button
    >
    <Button color="warning" size="sm" on:click={confirmDelete}>Confirm</Button>
  </ModalFooter>
</Modal>
<Modal id="editModal" isOpen={editModalOpen} backdrop="static" {toggleEditOpen}>
  <ModalHeader {toggleEditOpen}>Edit Association</ModalHeader>
  <ModalBody id="editModalBody">Edit stuff goes here....</ModalBody>
  <ModalFooter>
    <Button color="secondary" size="sm" on:click={toggleEditOpen}>Cancel</Button
    >
    <Button color="success" size="sm" on:click={confirmEdit}>Confirm</Button>
  </ModalFooter>
</Modal>
