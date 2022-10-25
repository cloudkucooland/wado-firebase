<script lang="ts">
  // import { createEventDispatcher } from "svelte";
  // import { Nav, NavLink } from "sveltestrap";
  import { FlatToast, ToastContainer } from "svelte-toasts";
  // import { notifyError } from "../notify";
  import { recordEvent } from "../firebase";

  // export const dispatch = createEventDispatcher();

  recordEvent("page_view");
</script>

<main role="main" class="cover-container text-center mx-auto">
  <ToastContainer let:data>
    <FlatToast {data} />
  </ToastContainer>
  <ol>
    <li>Determine Date from systemclock/query</li>
    <li>Determine season/proper/year/etc from date</li>
    <li>Determine Office from date/query</li>
    <li>Load svelte component for office</li>
    <li>Query associations for office, loading from firestore</li>
    <li>...</li>
    <li>Draw it</li>
  </ol>
</main>
