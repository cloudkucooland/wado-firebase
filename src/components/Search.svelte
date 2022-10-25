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

  let isOpen = false;
  let location = "Any";
  let query = "";

  const locations = Array("LAUDS-BS", "VESPER-BS");

  function requery(e) {
    console.log(e);
    console.log(query);
    console.log(location);

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
              <Label for="search">Search</Label>
              <Input
                type="search"
                name="search"
                id="search"
                placeholder="Water"
                on:change={requery}
                bind:value={query}
              />
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
            <h1>Results</h1>
          </CardHeader>
          <CardBody class="card-body" />
        </Card>
      </Col>
    </Row>
  {/if}
</Container>
