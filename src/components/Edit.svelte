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
    doc,
  } from "firebase/firestore";
  import { db } from "../firebase";

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

  async function loadPrayer() {
    const ref = doc(db, "prayers/" + id);
    // console.log(ref, ref.path);

    try {
      let toEdit = await getDoc(ref);
      const d = toEdit.data();

      console.log(d.Class);
      const c = classes.get(d.Class);
      console.log(c);
      const modelData = new c(d);
      console.log(modelData);

      return modelData;

      // convert to right model/class

      // load associations
      // const associations = new Map();

    } catch (e) {
      console.log(e);
    }
    console.log("fell through?");
    return {};
  }
</script>

{#await loadPrayer()}
  <div>Loading</div>
{:then data}
  <Container>
    <Row>
      <Col>
        <Card class="mb-2">
          <CardHeader>Editing: {data.name}</CardHeader>
          <CardBody class="card-body">
            <textarea>{data.body}</textarea>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
{:catch e}
  <div>{e}</div>
{/await}
