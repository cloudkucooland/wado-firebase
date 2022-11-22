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
    Table,
  } from "sveltestrap";
  import { collection, query, where } from "firebase/firestore";
  import { db, getDocsCacheFirst } from "../firebase";
  import BrowseItem from "./BrowseItem.svelte";
  import association from "../model/association";

  let location = "Any";

  async function requery(l) {
    const newAssoc = new Array();

    const q = query(collection(db, "associations"), where("Location", "==", l));

    const res = await getDocsCacheFirst(q);
    res.forEach((a) => {
      const ax = new association(a);
      newAssoc.push(ax);
    });

    return newAssoc;
  }
</script>

<svelte:head>
  <title>Browse: {location}</title>
</svelte:head>

<Container>
  <Row>
    <Col>
      <Card>
        <CardHeader>
          <h1>Browse</h1>
        </CardHeader>
        <CardBody>
          <div><a href="#/editlocation/{location}">Edit {location}</a></div>
          <Form>
            <FormGroup>
              <Label for="locations">Location</Label>
              <Input type="select" name="locations" bind:value={location}>
                <option>Any</option>
                {#each association.locations as L}
                  <option>{L}</option>
                {/each}
              </Input>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>{location}</CardHeader>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>Prayer</th>
                <th>Licensed</th>
                <th>Reviewed</th>
                <th>Class</th>
              </tr>
            </thead>
            <tbody>
              {#await requery(location) then ax}
                {#each ax as a}
                  <BrowseItem association={a} />
                {/each}
              {/await}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
