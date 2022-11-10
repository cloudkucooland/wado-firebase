<script>
  import { showMedia, showEdit, offline } from "../model/preferences";
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
      document.getElementById("offline").checked = $offline;
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
      <Card>
        <CardHeader>Settings</CardHeader>
        <CardBody>
          <Form>
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
              <div>
                This isn't used yet, but will be once we start supporting media
              </div>
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
              <div>
                Turn on displaying links on the main pages for editing elements.
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="offline">Store Offline Data</Label>
              <Input
                name="offline"
                id="offline"
                type="checkbox"
                on:change={(e) => {
                  offline.set(e.target.checked);
                }}
              />
              <div>
                If you need to use WADO when you don't have data service, enable
                this and reload the main page. This will use a lot of data on
                the first load, and it will be slow until the entire load is
                complete. Do not enable this on "always connected" devices
                (desktop computers) since it won't do anything useful, but will
                increases server load/costs.
              </div>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
