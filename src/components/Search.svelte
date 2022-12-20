<script lang="ts">
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
  import { link } from "svelte-spa-router";
  import type { SearchResponse } from "../../node_modules/meilisearch/dist/types/types/types";

  let result: SearchResponse = {
    hits: new Array(),
    processingTimeMs: 0,
    query: "",
  };

  async function doSearchLetter(e: Event) {
    const t = e.target as HTMLInputElement;
    if (t.value.length < 4) return;

    try {
      result = await index.search(t.value, {
        attributesToRetrieve: ["fsid", "Name", "Body"],
        filter: [["Class = Prayer", "Class = Hymn", "Class = Antiphon"]],
      });
      recordEvent("search", {
        short: true,
        query: t.value,
        results: result.estimatedTotalHits,
      });
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }

  async function doSearch(e: Event) {
    const t = e.target as HTMLInputElement;
    try {
      result = await index.search(t.value, {
        attributesToRetrieve: ["fsid", "Name", "Body", "Class"],
        filter: [["Class = Prayer", "Class = Hymn", "Class = Antiphon"]],
      });
      toasts.success(
        "Found " + result.estimatedTotalHits,
        "Displaying " + result.hits.length
      );
      recordEvent("search", {
        short: false,
        query: t.value,
        results: result.estimatedTotalHits,
      });
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }
</script>

<svelte:head>
  <title>WADO Prayer Search</title>
</svelte:head>

<Container>
  <Row class="justify-content-center">
    <Col xs="12" lg="10" xl="8">
      <h2 class="h3 mb-4 page-title">Search</h2>
      <Input on:change={doSearch} on:keypress={doSearchLetter} />
      <div class="my-4">
        <strong class="mb-0">Results</strong>
        <ListGroup class="mb-5 shadow">
          {#each result.hits as r}
            <ListGroupItem>
              <Row class="align-items-center">
                <Col>
                  <strong class="mb-0">
                    <a href="/edit/{r.fsid}" use:link>{r.Name}</a>
                    <span class="adonai">( {r.Class} )</span>
                  </strong>
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
