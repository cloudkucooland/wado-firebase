<script lang="ts">
  import { Spinner } from "sveltestrap";
  import { addDoc, getDocFromServer, collection } from "firebase/firestore";
  import { db, auth, recordEvent } from "../firebase";
  import { toasts } from "svelte-toasts";
  import { push, link } from "svelte-spa-router";
  import prayer from "../model/prayer";

  async function addPrayer(): Promise<string> {
    const placeholder = new prayer({
      Name: "• New Prayer",
      Body: "Unset",
      Author: "",
      Reviewed: false,
      License: false,
      "Last Editor": auth.currentUser.displayName,
      "Last Edited": "never",
      Class: "prayer",
    });

    console.log("adding placeholder", placeholder);

    try {
      const added = await addDoc(
        collection(db, "prayers"),
        placeholder.toFirebase()
      );
      const refetched = await getDocFromServer(added);
      toasts.success("created");
      recordEvent("add_prayer", { id: added.id, new: refetched.id });
      push("/edit/" + added.id);
      return added.id;
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
      return null;
    }
  }
</script>

{#await addPrayer()}
  <Spinner />
{:then e}
  <a href="/edit/{e}" use:link>Edit New Prayer</a>
{/await}
