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
</script>

{#await loadPrayer()}
  <Spinner color="primary" />
{:then data}
  <Container>
    <Row>
      <Col>
        <Card class="mb-2">
          <CardHeader>Editing: {data.name}</CardHeader>
          <CardBody class="card-body">
            <Form>
              <FormGroup>
                <Label for="class">Class</Label>
                <Input type="select" name="class" id="class">
                  {#each [...classes] as [c, x]}
                    {#if data.class == c}
                      <option selected="selected">{c}</option>
                    {:else}
                      <option>{c}</option>
                    {/if}
                  {/each}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input name="name" id="name" value={data.name} />
              </FormGroup>
              <textarea rows="30" cols="100" value={data.body} />
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
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
{:catch e}
  <div>{e}</div>
{/await}
