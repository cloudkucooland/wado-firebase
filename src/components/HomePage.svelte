<script lang="ts">
  // import { createEventDispatcher } from "svelte";
  import { Container, Col, Row, Card, CardHeader, CardBody } from "sveltestrap";
  import { FlatToast, ToastContainer } from "svelte-toasts";
  // import { notifyError } from "../notify";
  import { recordEvent } from "../firebase";
  import None from "./None.svelte";
  import proper from "../model/proper";

  // export const dispatch = createEventDispatcher();

  recordEvent("page_view");
  const forProper = new proper({ season: "advent", week: 1 }); // determine from clock or query
  forProper.season = "advent";
  forProper.week = 1;
  const office = None; // determine from clock or query
</script>

<main role="main" class="cover-container text-center mx-auto">
  <ToastContainer let:data>
    <FlatToast {data} />
  </ToastContainer>

  <Container>
    <Row>
      <Col>
        <Card>
          <CardHeader>None</CardHeader>
          <CardBody>
            <svelte:component this={office} proper={forProper} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
</main>
