<script>
  import { debugOn, showMedia, showEdit } from "../model/preferences";
  import { onMount } from "svelte";

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

  onMount(() => {
    try {
      document.getElementById("debugOn").checked = $debugOn;
      document.getElementById("showMedia").checked = $showMedia;
      document.getElementById("showEdit").checked = $showEdit;
    } catch (e) {
      console.log(e);
    }
  });
</script>

<Container>
  <Row>
    <Col>
      <Card class="mb-2">
        <CardHeader>Settings</CardHeader>
        <CardBody>
          <Form>
            <FormGroup>
              <Label for="debugOn">Debug</Label>
              <Input
                name="debugOn"
                id="debugOn"
                type="checkbox"
                on:change={(e) => {
                  debugOn.set(e.target.checked);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="showMedia">Show Media Links</Label>
              <Input
                name="showMedia"
                id="showMedia"
                type="checkbox"
                on:change={(e) => {
                  showMedia.set(e.target.checked);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="showEdit">Show Edit Links</Label>
              <Input
                name="showEdit"
                id="showEdit"
                type="checkbox"
                on:change={(e) => {
                  showEdit.set(e.target.checked);
                }}
              />
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
