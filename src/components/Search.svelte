<script>
  import {
    Input,
    Container,
    Row,
    Col,
    ListGroup,
    ListGroupItem,
  } from "sveltestrap";
  import { index } from "../meili";
  import { toasts } from "svelte-toasts";
  import { recordEvent } from "../firebase";

  let result = {
    hits: new Array(),
  };

  async function doSearchLetter(e) {
    if (e.target.value.length < 4) return;

    try {
      result = await index.search(e.target.value, {
        attributesToRetrieve: ["fsid", "Name", "Body"],
        filter: [["Class = Prayer", "Class = Hymn", "Class = Antiphon"]],
      });
      recordEvent("search", {
        short: true,
        query: e.target.value,
        results: result.estimatedTotalHits,
      });
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }

  async function doSearch(e) {
    try {
      result = await index.search(e.target.value, {
        attributesToRetrieve: ["fsid", "Name", "Body"],
        filter: [["Class = Prayer", "Class = Hymn", "Class = Antiphon"]],
      });
      toasts.success(
        "Found " + result.estimatedTotalHits,
        "Displaying " + result.hits.length
      );
      recordEvent("search", {
        short: false,
        query: e.target.value,
        results: result.estimatedTotalHits,
      });
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }
</script>

<Container>
  <Row class="justify-content-center">
    <Col xs="12" lg="10" xl="8" mx="auto">
      <h2 class="h3 mb-4 page-title">Search</h2>
      <Input on:change={doSearch} on:keypress={doSearchLetter} />
      <div class="my-4">
        <strong class="mb-0">Results</strong>
        <ListGroup class="mb-5 shadow">
          {#each result.hits as r}
            <ListGroupItem>
              <Row class="align-items-center">
                <Col>
                  <strong class="mb-0"
                    ><a href="#/edit/{r.fsid}">{r.Name}</a></strong
                  >
                  <p class="mb-0">{@html r.Body}</p>
                </Col>
              </Row>
            </ListGroupItem>
          {/each}
        </ListGroup>
      </div>
    </Col>
  </Row>
</Container>
