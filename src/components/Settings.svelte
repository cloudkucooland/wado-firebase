<script>
  import { debugOn, showMedia } from "../model/preferences";
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
    console.log("Setttings onMount", e); 
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
                <Input name="debugOn" id="debugOn" type="checkbox" value="true" on:change={(e) => { debugOn.set(e.srcElement.value); }} />
              </FormGroup>
              <FormGroup>
                <Label for="showMedia">Show Media Links</Label>
                <Input
                  name="showMedia"
                  id="showMedia"
                  type="checkbox"
                  value="true"
                  on:change={(e) => { showMedia.set(e.srcElement.value); }}
                />
              </FormGroup>
            </Form>
          </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
