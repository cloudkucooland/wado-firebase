<script lang="ts">
  // import { createEventDispatcher } from "svelte";
  // import { Nav, NavLink } from "sveltestrap";
  import { FlatToast, ToastContainer } from "svelte-toasts";
  // import { notifyError } from "../notify";

  // export const dispatch = createEventDispatcher();
</script>

<main class="cover-container text-center mx-auto">
  <ToastContainer let:data>
    <FlatToast {data} />
  </ToastContainer>
  <h1 class="display-2 font-weight-bold">WADO</h1>
  <p class="h2">Settings</p>
  <hr />
  <ol>
    <li>settings</li>
  </ol>
</main>
