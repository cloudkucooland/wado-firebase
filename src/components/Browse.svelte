<script>
  import {
    Container,
    Col,
    Row,
    Card,
    CardHeader,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
  } from "sveltestrap";
  import { locations } from "../util";
  import { collection, query, where, getDocs } from "firebase/firestore";
  import { db } from "../firebase";
  import BrowseItem from "./BrowseItem.svelte";

  let isOpen = false;
  let location = "Any";
  let prayers = [];

  async function requery(e) {
    isOpen = false;
    prayers = [];
    console.log(location);

    const q = query(
      collection(db, "associations"),
      where("Location", "==", location)
    );

    const res = await getDocs(q);
    res.forEach((doc) => {
      prayers.push(doc.data().Reference)
    });

    isOpen = true;
  }
</script>

<Container>
  <Row>
    <Col>
      <Card class="mb-2">
        <CardHeader>
          <h1>Search</h1>
        </CardHeader>
        <CardBody class="card-body">
          <Form>
            <FormGroup>
              <Label for="locations">Location</Label>
              <Input
                type="select"
                name="locations"
                id="locations"
                on:change={requery}
                bind:value={location}
              >
                <option>Any</option>
                {#each locations as L}
                  <option>{L}</option>
                {/each}
              </Input>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Col>
  </Row>
  {#if isOpen}
    <Row>
      <Col>
        <Card class="mb-2">
          <CardHeader>
            <h1>Results in {location}</h1>
          </CardHeader>
          <CardBody class="card-body" id="resultbody" />
        </Card>
      </Col>
    </Row>
    {#each prayers as p}
      <Row>
        <Col>
          <BrowseItem ref={p} />
        </Col>
      </Row>
    {/each}
  {/if}
</Container>
