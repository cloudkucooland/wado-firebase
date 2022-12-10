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
    Nav,
    NavLink,
  } from "sveltestrap";
  import {
    collection,
    query,
    where,
    doc,
    getDocs,
    deleteDoc,
    orderBy,
    // getCountFromServer,
  } from "firebase/firestore";
  import {
    db,
    recordEvent,
    screenView,
    // getDocsCacheFirst,
  } from "../firebase";
  import prayer from "../model/prayer";
  import { onMount, getContext } from "svelte";
  import { toasts } from "svelte-toasts";
  import { push } from "svelte-spa-router";

  export let params = { c };
  $: prayerClass = params.c ? params.c : "prayer";
  $: prayers = new Map();
  let modalId = "exnihilo";
  let me = getContext("me");

  const cs = new Array("prayer", "hymn", "psalm", "antiphon");

  let deleteModalOpen = false;
  function toggleDeleteOpen(e) {
    screenView("toggleDeleteOpen");
    deleteModalOpen = !deleteModalOpen;
    if (deleteModalOpen) modalId = e.target.value;
  }

  async function confirmDelete(e) {
    recordEvent("delete_prayer", { id: e.target.value });
    deleteModalOpen = !deleteModalOpen;

    try {
      const toDelete = doc(db, "prayers", e.target.value);

      const q = query(
        collection(db, "associations"),
        where("Reference", "==", doc(db, "prayers", e.target.value))
      );
      const res = await getDocs(q);
      for (const asn of res.docs) {
        await deleteDoc(doc(db, "associations", asn.id));
      }

      await deleteDoc(toDelete);
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
    const newPrayers = new Array();
    for (const p of prayers) {
      if (p.id != e.target.value) {
        newPrayers.push(p);
      }
    }
    prayers = newPrayers;
    toasts.success("Prayer deleted", e.target.value);
  }

  // https://github.com/firebase/snippets-web/blob/36740fb2c39383621c0c0a948236e9eab8a71516/snippets/firestore-next/test-firestore/paginate.js#L8-L23
  async function loadClass(pc) {
    const m = new Map();
    try {
      const q = query(
        collection(db, "prayers"),
        where("Class", "==", pc),
        orderBy("Name")
      );
      const res = await getDocs(q);
      for (const a of res.docs) {
        const p = new prayer(a.data());
        m.set(a.id, p);
      }
    } catch (e) {
      console.log(e);
    }
    return m;
  }

  onMount(async () => {
    prayers = await loadClass(prayerClass);
    screenView("Prayer List");
  });
</script>

<svelte:head>
  <title>WADO Prayer List: {prayerClass}</title>
</svelte:head>

<Container>
  <Nav>
    {#each cs as cx}
      <NavLink
        href="/prayers/{cx}/"
        on:click={async () => {
          prayers = await loadClass(cx);
        }}>{cx}</NavLink
      >
    {/each}
    <NavLink>
      <Button
        on:click={() => {
          push("/addPrayer");
        }}
        color="success">Add Prayer</Button
      >
    </NavLink>
  </Nav>
  <Row>
    <Col>
      <Card>
        <CardHeader>{prayerClass}</CardHeader>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>Prayer</th>
                <th>Licensed</th>
                <th>Reviewed</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {#each [...prayers] as [k, v]}
                <tr id={k}>
                  <td>
                    <a
                      href="#/edit/{k}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {v.name}
                    </a>
                  </td>
                  <td>{v.license}</td>
                  <td>{v.reviewed}</td>
                  <td>
                    {#if $me.isEditor}
                      <Button
                        on:click={toggleDeleteOpen}
                        value={k}
                        color="warning"
                      >
                        Delete
                      </Button>
                    {/if}
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
