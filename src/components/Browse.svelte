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
  import association from "../model/association";

  let isOpen = false;
  let location = "Any";
  let associations = [];

  async function requery() {
    isOpen = false;
    associations = [];

    const q = query(
      collection(db, "associations"),
      where("Location", "==", location)
    );

    const res = await getDocs(q);
    res.forEach((a) => {
      const ax = new association(a);
      associations.push(ax);
    });

    isOpen = true;
  }
</script>

<Container>
  <Row>
    <Col>
      <Card>
        <CardHeader>
          <h1>Browse</h1>
        </CardHeader>
        <CardBody>
          <Form>
            <FormGroup>
              <Label for="locations">Location</Label>
              <Input
                type="select"
                name="locations"
                id="locations"
                bind:value={location}
                on:change={requery}
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
        <Card>
          <CardHeader>
            <h1>Results in {location}</h1>
          </CardHeader>
          <CardBody />
        </Card>
      </Col>
    </Row>
    {#each associations as a}
      <Row>
        <Col>
          <BrowseItem association={a} />
        </Col>
      </Row>
    {/each}
  {/if}
</Container>
