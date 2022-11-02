<script>
  import { onMount } from "svelte";
  import {
    Container,
    Row,
    Col,
    Card,
    CardSubtitle,
    CardHeader,
    CardBody,
    CardFooter,
  } from "sveltestrap";
  import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    DocumentReference,
  } from "firebase/firestore";
  import { db } from "../firebase";

  export let params = { id: string };
  $: id = params.id ? params.id : "ex nihilo";
  console.log(id);

  let doc;

  async function loadPrayer() {
    console.log("loadPrayer");
    const associations = new Map();

    try {
      const ref = new DocumentReference(id);
      console.log(ref);
      doc = await getDoc(ref);
      console.log(doc);
    } catch (e) {
      console.log(e);
    }

    if (typeof doc === "undefined") {
      try {
        const q = query(
          collection(db, "prayers"),
          where("Name", "==", id)
        );

        const res = await getDocs(q);
        res.forEach((a) => {
          console.log(a);
          doc = a;
        });
      } catch (e) {
        console.log(e);
      }
    }
    console.log(doc);
  }

  onMount(() => {
    console.log("onMount");
    loadPrayer();
  });
</script>

{#await loadPrayer}
  <Container>
    <Row>
      <Col>
        <Card class="mb-2">
          <CardHeader>Editing: {doc.data().name}</CardHeader>
          <CardBody class="card-body">
            <textarea>{doc.data().body}</textarea>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
{/await}
