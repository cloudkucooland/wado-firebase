<script>
  import { Spinner } from "sveltestrap";
  import { addDoc, getDocFromServer, collection } from "firebase/firestore";
  import { db, auth, recordEvent } from "../firebase";
  import { toasts } from "svelte-toasts";
  import prayer from "../model/prayer";

  async function addPrayer() {
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
      console.log("added, now refetching");
      const refetched = await getDocFromServer(added);
      console.log("refetched", refetched);
      toasts.success("created");
      recordEvent("add_prayer", { id: added.id, new: added.id });
      console.log("loading edit screen", added.id);
      document.location.assign("#/edit/" + added.id);
      return added.id;
    } catch (err) {
      console.log(err);
      toasts.error(err.message);
    }
  }
</script>

{#await addPrayer()}
  <Spinner />
{:then e}
  <a href="#/edit/{e}">Edit New Prayer</a>
{/await}
