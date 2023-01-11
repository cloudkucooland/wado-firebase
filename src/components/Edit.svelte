<script lang="ts">
  import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
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
  import { db, auth, recordEvent, screenView } from "../firebase";
  import { classes, getClass } from "../model/prayerClasses";
  import { toasts } from "svelte-toasts";
  import { link } from "svelte-spa-router";
  import { getContext, onMount } from "svelte";
  import type { Readable } from "svelte/store";
  import type User from "../../types/model/user";
  import type { prayerFromFirestore } from "../model/types";
  import EditMedia from "./EditMedia.svelte";
  import EditAssoc from "./EditAssoc.svelte";

  import {
    createEditor,
    Editor,
    EditorContent,
    BubbleMenu,
  } from "svelte-tiptap";
  import StarterKit from "@tiptap/starter-kit";
  import Underline from "@tiptap/extension-underline";
  import Typography from "@tiptap/extension-typography";

  import association from "../model/association";
  import prayer from "../model/prayer";
  import type Hymn from "../../types/model/hymn";
  import type Psalm from "../../types/model/psalm";
  import type Antiphon from "../../types/model/antiphon";

  let me: Readable<User> = getContext("me");
  let editor: Readable<Editor>;

  // @ts-ignore
  export let params = { id };
  const id: string = params.id ? params.id : "exnihilo";
  let modalId: string = "";
  let assocEditResult: association;
  let assocAddResult: association;
  const _p: prayer | Hymn | Psalm | Antiphon = new prayer({
    Name: "Loading",
    Body: "Loading",
  });
  $: prayerData = _p;
  const _a: Array<association> = new Array();
  $: associations = _a;

  let deleteModalOpen: boolean = false;
  function toggleDeleteOpen(e: Event): void {
    const t = e.target as HTMLInputElement;
    screenView("toggleDeleteOpen");
    deleteModalOpen = !deleteModalOpen;
    if (deleteModalOpen) modalId = t.value;
  }

  async function confirmDelete(e: Event): Promise<void> {
    const t = e.target as HTMLInputElement;
    recordEvent("delete_assoc", { id: id, assoc: t.value });
    deleteModalOpen = !deleteModalOpen;

    try {
      await deleteDoc(doc(db, "associations", t.value));
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
    const newAssn: Array<association> = new Array();
    for (const a of associations) {
      if (a.id != t.value) newAssn.push(a);
    }
    associations = newAssn;
    toasts.success("Association deleted", t.value);
  }

  let editModalOpen: boolean = false;
  async function toggleEditOpen(e: Event): Promise<void> {
    const t = e.target as HTMLInputElement;
    screenView("toggleEditOpen");
    editModalOpen = !editModalOpen;

    if (editModalOpen) modalId = t.value;
  }

  async function confirmEdit(e: Event) {
    const t = e.target as HTMLInputElement;
    recordEvent("edit_assoc", { id: id, assoc: t.value });
    editModalOpen = !editModalOpen;

    try {
      await setDoc(
        doc(db, "associations", t.value),
        assocEditResult.toFirebase()
      );
      const newAssn: Array<association> = new Array();
      for (const a of associations) {
        if (a.id != t.value) newAssn.push(a);
      }
      newAssn.push(assocEditResult);
      associations = newAssn;
      toasts.success("Saved Association", t.value);
    } catch (error) {
      console.log(error);
      toasts.error(error.message);
    }
  }

  let addAssocModalOpen: boolean = false;
  async function toggleAddAssocOpen(e: Event): Promise<void> {
    const t = e.target as HTMLInputElement;
    screenView("toggleAddAssocOpen");
    addAssocModalOpen = !addAssocModalOpen;

    if (addAssocModalOpen) modalId = t.value;
  }

  async function confirmAddAssoc(): Promise<void> {
    addAssocModalOpen = !addAssocModalOpen;

    try {
      const added = await addDoc(
        collection(db, "associations"),
        assocAddResult.toFirebase()
      );
      const refetched = await getDoc(added);
      // https://svelte.dev/tutorial/updating-arrays-and-objects
      associations = [
        ...associations,
        new association(refetched.id, refetched.data()),
      ];
      recordEvent("add_assoc", { id: id, new: added.id });
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }

  async function loadPrayer(): Promise<void> {
    const ref = doc(db, "prayers/" + id);

    try {
      const toEdit = await getDoc(ref);
      const d = toEdit.data() as prayerFromFirestore;

      const c = getClass(d.Class);
      prayerData = new c(d);

      const q = query(
        collection(db, "associations"),
        where("Reference", "==", ref)
      );
      const res = await getDocs(q);
      for (const a of res.docs) {
        // https://svelte.dev/tutorial/updating-arrays-and-objects
        associations = [...associations, new association(a.id, a.data())];
      }
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }

  async function saveChanges(): Promise<void> {
    recordEvent("save_prayer", { id: id });

    try {
      prayerData.body = $editor.getHTML();
      prayerData.lastEditor = auth.currentUser.displayName;
      prayerData.lastEdited = new Date().toISOString();
      await setDoc(doc(db, "prayers", id), prayerData.toFirebase());
      toasts.success("Saved Prayer", id);
    } catch (err) {
      console.error(err);
      toasts.error(err.message);
    }
  }

  onMount(async () => {
    screenView("Edit Prayer");
    await loadPrayer();
    editor = createEditor({
      extensions: [StarterKit, Underline, Typography],
      content: prayerData.body,
    });
  });
</script>

<svelte:head>
  <title>Editing: {prayerData.name}</title>
</svelte:head>

<Container>
  <Row>
    <Col>
      <Card class="mb-2">
        {#if $me.isEditor}
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
                    disabled={!$me.isEditor}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                {#if $me.isEditor}
                  <Button
                    size="sm"
                    color="secondary"
                    on:click={$editor.chain().focus().toggleBold().run()}
                    >Bold</Button
                  >
                  <Button
                    size="sm"
                    color="secondary"
                    on:click={$editor.chain().focus().toggleItalic().run()}
                    >Italic</Button
                  >
                  <Button
                    size="sm"
                    color="secondary"
                    on:click={$editor.chain().focus().toggleUnderline().run()}
                    >Underline</Button
                  >
                  <Button
                    size="sm"
                    color="secondary"
                    on:click={$editor.chain().focus().undo().run()}>Undo</Button
                  >
                  <Button
                    size="sm"
                    color="secondary"
                    on:click={$editor.chain().focus().redo().run()}>Redo</Button
                  >
                  <EditorContent editor={$editor} />
                  {#if $editor}<BubbleMenu editor={$editor} />{/if}
                {:else}
                  <p>{@html prayerData.body}</p>
                {/if}
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
                      disabled={!$me.isEditor}
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
                      disabled={!$me.isEditor}
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
                      disabled={!$me.isEditor}
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
                    disabled={!$me.isEditor}
                  >
                    {#each Array.from(classes.keys()) as key}
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
                    disabled={!$me.isEditor}
                  />
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label for="lastEditor">Last Editor</Label>
                  <Input
                    name="lastEditor"
                    disabled={true}
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
                    disabled={true}
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
                    disabled={!$me.isEditor}
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
                    disabled={!$me.isEditor}
                  />
                </FormGroup>
              </Col>
              <Col sm="7">&nbsp;</Col>
              <Col sm="1">
                {#if $me.isEditor}
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
                    <a href="/editlocation/{v.Location}" use:link
                      >{v.Location}</a
                    >
                  </td>
                  <td>{v.CalendarDate}</td>
                  <td>{v.Season}</td>
                  <td>{v.ProperDisplay}</td>
                  <td>{v.WeekdayDisplay}</td>
                  <td>{v.Year}</td>
                  <td>{v.Weight}</td>
                  <td>
                    {#if $me.isEditor}
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
          {#if $me.isEditor}
            <Button size="sm" color="success" on:click={toggleAddAssocOpen}
              >Add</Button
            >
          {/if}
        </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
<Modal id="deleteModal" isOpen={deleteModalOpen} backdrop="static">
  <ModalHeader>Delete Association</ModalHeader>
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
<Modal id="editModal" isOpen={editModalOpen} size="xl">
  <ModalHeader>Edit Association</ModalHeader>
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
<Modal id="addAssocModal" isOpen={addAssocModalOpen} size="xl">
  <ModalHeader>Add Association</ModalHeader>
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
</style>
