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

  import CKEditor from "ckeditor5-svelte";
  import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor";
  let editor = DecoupledEditor;
  // let editorInstance = null;
  // let editorData = "The Holy One be with you.";
  let editorConfig = {
    toolbar: {
      items: ["heading", "|", "bold", "italic", "underline"],
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
  const editorPerm = isEditor();

  const classes = new Map([
    ["prayer", prayer],
    ["psalm", psalm],
    ["hymn", hymn],
    ["lection", lection],
    ["heartword", heartword],
  ]);

  async function loadPrayer() {
    const ref = doc(db, "prayers/" + id);

    try {
      const toEdit = await getDoc(ref);
      const d = toEdit.data();

      const c = classes.get(d.Class);
      const modelData = new c(d);
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

  function onReady({ detail: editor }) {
    // Insert the toolbar before the editable area.
    // editorInstance = editor;
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
          {#if editorPerm}
            <CardHeader>Editing: {data.name}</CardHeader>
          {:else}
            <CardHeader>Displaying: {data.name}</CardHeader>
          {/if}
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="class">Class</Label> ({data.class})
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
                    <td
                      ><a href="#/editlocation/{v.Location}">{v.Location}</a
                      ></td
                    >
                    <td>{v.CalendarDate}</td>
                    <td>{v.Season}</td>
                    <td>{v.Proper}</td>
                    <td>{v.Weekday}</td>
                    <td>{v.Year}</td>
                    <td>{v.Weight}</td>
                    <td>edit / delete</td>
                  </tr>
                {/each}
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
