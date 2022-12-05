<script>
  import { showMedia, showEdit, showAlt } from "../model/preferences";
  import { onMount, getContext } from "svelte";

  import {
    Container,
    Col,
    Row,
    Input,
    ListGroup,
    ListGroupItem,
  } from "sveltestrap";
  let me = getContext("me");

  // does bind not work?
  onMount(() => {
    try {
      // document.getElementById("offline").checked = $offline;
      document.getElementById("showMedia").checked = $showMedia;
      document.getElementById("showEdit").checked = $showEdit;
      document.getElementById("showAlt").checked = $showAlt;
    } catch (e) {
      console.log(e);
    }
  });
</script>

<svelte:head>
  <title>WADO User Settings</title>
</svelte:head>

<Container>
  <Row class="justify-content-center">
    <Col xs="12" lg="10" xl="8" mx="auto">
      <h2 class="h3 mb-4 page-title">Settings</h2>
      <div class="my-4">
        <strong class="mb-0">Display</strong>
        <ListGroup class="mb-5 shadow">
          <ListGroupItem>
            <Row class="align-items-center">
              <Col>
                <strong class="mb-0">Show Media</strong>
                <p class="text-muted mb-0">
                  Show controls for playing media files (when available).
                </p>
              </Col>
              <Col sm="auto">
                <div class="custom-control custom-switch">
                  <Input
                    type="checkbox"
                    class="custom-control-input"
                    id="showMedia"
                    on:change={(e) => {
                      showMedia.set(e.target.checked);
                    }}
                  />
                  <span class="custom-control-label" />
                </div>
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem>
            <Row class="align-items-center">
              <Col>
                <strong class="mb-0">Show Alternatives</strong>
                <p class="text-muted mb-0">
                  Show additional prayer options (when available).
                </p>
              </Col>
              <Col sm="auto">
                <div class="custom-control custom-switch">
                  <Input
                    type="checkbox"
                    class="custom-control-input"
                    id="showAlt"
                    on:change={(e) => {
                      showAlt.set(e.target.checked);
                    }}
                  />
                  <span class="custom-control-label" />
                </div>
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem>
            <Row class="align-items-center">
              <Col>
                <strong class="mb-0">Show Edit Links</strong>
                <p class="text-muted mb-0">
                  Show links to edit prayers & locations.
                </p>
              </Col>
              <Col sm="auto">
                <div class="custom-control custom-switch">
                  <Input
                    type="checkbox"
                    class="custom-control-input"
                    id="showEdit"
                    on:change={(e) => {
                      showEdit.set(e.target.checked);
                    }}
                  />
                  <span class="custom-control-label" />
                </div>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
        <strong class="mb-0">Profile</strong>
        <ListGroup class="mb-5 shadow">
          <ListGroupItem>
            <Row class="align-items-center">
              <Col>
                <strong class="mb-0">Display Name</strong>
                <p class="text-muted mb-0">
                  How your name is presented to others.
                </p>
              </Col>
              <Col sm="auto">
                <div class="custom-control">
                  <Input
                    class="custom-control-input"
                    id="displayName"
                    on:change={(e) => {
                      $me.setDisplayName(e.target.value);
                    }}
                    value={$me.displayName}
                  />
                  <span class="custom-control-label">Currently Unused.</span>
                </div>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </div></Col
    >
  </Row>
</Container>
