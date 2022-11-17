<script>
  import { showMedia, showEdit, showAlt, offline } from "../model/preferences";
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

  // does bind not work?
  onMount(() => {
    try {
      document.getElementById("offline").checked = $offline;
      document.getElementById("showMedia").checked = $showMedia;
      document.getElementById("showEdit").checked = $showEdit;
      document.getElementById("showAlt").checked = $showAlt;
    } catch (e) {
      console.log(e);
    }
  });
</script>

<svelte:head>
  <title>User Settings</title>
</svelte:head>

<Container>
  <Row>
    <Col>
      <Card>
        <CardHeader>Settings</CardHeader>
        <CardBody>
          <Form>
            <FormGroup>
              <Label for="showMedia">Show Media</Label>
              <Input
                name="showMedia"
                id="showMedia"
                type="checkbox"
                on:change={(e) => {
                  showMedia.set(e.target.checked);
                }}
              />
              <div>
                Show controls for items with attached media (recordings)
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="showAlt">Show Alternatives</Label>
              <Input
                name="showAlt"
                id="showAlt"
                type="checkbox"
                on:change={(e) => {
                  showAlt.set(e.target.checked);
                }}
              />
              <div>Show alternatives for the various prayers/hymns/etc.</div>
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
