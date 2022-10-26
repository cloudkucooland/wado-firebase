<script>
  import { onMount } from "svelte";
  import { Card, CardHeader, CardBody } from "sveltestrap";
  import { getDoc } from "firebase/firestore";

  export let ref;
  let name = "loading";
  let body = "loading";

  onMount(async () => {
    const doc = await getDoc(ref);
    const d = doc.data();
    name = d.Name;
    body = d.Body;
  });
</script>

<Card class="mb-2">
  <CardHeader>
    <h2><a href="#/edit/{ref.id}">{name}</a></h2>
  </CardHeader>
  <CardBody class="card-body">
    {@html body}
  </CardBody>
</Card>
