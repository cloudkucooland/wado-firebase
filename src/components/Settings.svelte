<script>
  import { debugOn, showMedia, showEdit } from "../model/preferences";
  import { auth } from "../firebase";
  import { collection, query, where, getDocs } from "firebase/firestore";
  import { onMount } from "svelte";

  import {
    Container,
    Col,
    Row,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Form,
    FormGroup,
    Label,
    Input,
  } from "sveltestrap";

  onMount((e) => {
    // console.log("Setttings onMount", e);
  });

  $: debugChecked = $debugOn ? "checked" : "";
  $: editChecked = $showEdit ? "checked" : "";
  $: mediaChecked = $showMedia ? "checked" : "";
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
                {debugChecked}
                on:change={(e) => {
                  debugOn.set(e.srcElement.checked);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="showMedia">Show Media Links</Label>
              <Input
                name="showMedia"
                id="showMedia"
                type="checkbox"
                {mediaChecked}
                on:change={(e) => {
                  showMedia.set(e.srcElement.checked);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="showEdit">Show Edit Links</Label>
              <Input
                name="showEdit"
                id="showEdit"
                type="checkbox"
                {editChecked}
                on:change={(e) => {
                  showEdit.set(e.srcElement.checked);
                }}
              />
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
