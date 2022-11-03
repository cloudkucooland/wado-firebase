<script>
  import { onMount } from "svelte";
  import {
    Spinner,
    Container,
    Row,
    Col,
    Card,
    CardSubtitle,
    CardHeader,
    CardBody,
    CardFooter,
    Form,
    FormGroup,
    Input,
    Label,
  } from "sveltestrap";
  import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
  } from "firebase/firestore";
  import { db } from "../firebase";

  import CKEditor from "ckeditor5-svelte";
  import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor";
  let editor = DecoupledEditor;
  let editorInstance = null;
  let editorData = "The Holy One be with you.";
  let editorConfig = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline"
      ]
    }
  };

  import prayer from "../model/prayer";
  import psalm from "../model/psalm";
  import hymn from "../model/hymn";
  import lection from "../model/lection";
  import heartword from "../model/heartword";

  export let params = { id };
  const id = params.id ? params.id : "exnihilo";

  const classes = new Map([
    ["prayer", prayer],
    ["psalm", psalm],
    ["hymn", hymn],
    ["lection", lection],
    ["heartword", heartword],
  ]);
  console.log("classes");

  async function loadPrayer() {
    const ref = doc(db, "prayers/" + id);

    try {
      let toEdit = await getDoc(ref);
      const d = toEdit.data();

      console.log(d.Class);
      const c = classes.get(d.Class);
      const modelData = new c(d);

      // convert to right model/class
      // load associations
      // const associations = new Map();

      return modelData;
    } catch (e) {
      console.log(e);
    }
    console.log("fell through?");
    return {};
  }

  function onReady({ detail: editor }) {
    // Insert the toolbar before the editable area.
    editorInstance = editor;
    editor.ui.getEditableElement().parentElement.insertBefore( editor.ui.view.toolbar.element, editor.ui.getEditableElement());
  }
</script>

{#await loadPrayer()}
  <Spinner color="primary" />
{:then data}
  <Container>
    <Row>
      <Col>
        <Card class="mb-2">
          <CardHeader>Editing: {data.name}</CardHeader>
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
              <CKEditor editor={editor} on:ready={onReady} config={editorConfig} value={data.body} />
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
              {#if data.class == "prayer" || data.class == "heartword" }
                <FormGroup>
                  <Label for="author">Author</Label>
                  <Input name="author" id="author" value={data.author} />
                </FormGroup>
              {/if}
                <FormGroup>
                  <Label for="editor">Last Editor</Label>
                  <Input name="editor" id="editor" value={data.lastEditor} /> (will be auto-populated)
                </FormGroup>
                <FormGroup>
                  <Label for="edited">Last Edited</Label>
                  <Input name="edited" id="edited" value={data.lastEdited} /> (will be auto-populated)
                </FormGroup>
                <FormGroup>
                  <Label for="license">License</Label>
                  <Input name="license" id="license" value={data.license} /> (checkbox)
                </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
{:catch e}
  <div>{e}</div>
{/await}
