<script>
  import { onMount } from "svelte";
  import {
    Card,
    CardSubtitle,
    CardHeader,
    CardBody,
    CardFooter,
  } from "sveltestrap";
  import { getDoc } from "firebase/firestore";

  export let association;
  let name = "loading";
  let body = "loading";
  let id = "unset";
  let copyright;

  onMount(async () => {
    const doc = await getDoc(association.reference);
    id = doc.id;
    const d = doc.data();
    name = d.Name;
    body = d.Body;
    copyright = d.Copyright;
  });
</script>

<Card class="mb-2">
  <CardHeader>
    <h2><a href="#/edit/{id}">{name}</a></h2>
  </CardHeader>
  <CardSubtitle>
    <div>Association: {association.id}</div>
    {#if association.season}
      <div>Season: {association.season}</div>
    {/if}
    {#if association.proper}
      <div>Proper: {association.proper}</div>
    {/if}
    {#if association.week}
      <div>Week: {association.week}</div>
    {/if}
    {#if association.weight}
      <div>Weight: {association.weight}</div>
    {/if}
  </CardSubtitle>
  <CardBody class="card-body">
    {@html body}
  </CardBody>
  <CardFooter>
    {#if copyright}
      <div>{copyright}</div>
    {/if}
  </CardFooter>
</Card>
