<script>
  import { onMount } from "svelte";
  import { getDocCacheFirst } from "../firebase";

  export let association;
  let id = "unset";
  let d = { Name: "Loading", License: false, Reviewed: false, Class: "prayer" };

  onMount(async () => {
    const doc = await getDocCacheFirst(association.Reference);
    if (!doc || !doc.exists()) {
      console.log("reference does not exist");
      d = { Name: "Failed", License: false, Reviewed: false, Class: "prayer" };
      return;
    }
    id = doc.id;
    d = doc.data();
  });
</script>

<tr>
  <td><a href="#/edit/{id}">{d.Name}</a> </td>
  <td>{d.License}</td>
  <td>{d.Reviewed}</td>
  <td>{d.Class}</td>
</tr>
