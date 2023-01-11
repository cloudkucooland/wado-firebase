<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import type prayer from "../../types/model/prayer";
  import { Container, Row, Col, Input, Button } from "sveltestrap";
  import { toasts } from "svelte-toasts";
  import {
    createEditor,
    Editor,
    EditorContent,
    BubbleMenu,
  } from "svelte-tiptap";
  import StarterKit from "@tiptap/starter-kit";
  import Underline from "@tiptap/extension-underline";
  import Typography from "@tiptap/extension-typography";
  import { getContext } from "svelte";
  import type { Readable } from "svelte/store";
  import type User from "../../types/model/user";

  export let result: prayer;
  let me: Readable<User> = getContext("me");
  let editor: Readable<Editor>;

  // I don't like doing this here... but I don't know where else to do it
  afterUpdate(() => {
    result.body = $editor.getHTML();
    // console.debug("afterUpdate", result);
  });

  onMount(async () => {
    editor = createEditor({
      extensions: [StarterKit, Underline, Typography],
      content: result.body,
    });
  });

  onDestroy(() => {
    // console.debug("destroying editor");
    $editor.destroy();
  });
</script>

<Container fluid>
  <Row>
    <Col sm="12">
      <Button
        size="sm"
        color="secondary"
        on:click={() => {
          $editor.chain().focus().toggleBold().run();
        }}>Bold</Button
      >
      <Button
        size="sm"
        color="secondary"
        on:click={() => {
          $editor.chain().focus().toggleItalic().run();
        }}>Italic</Button
      >
      <Button
        size="sm"
        color="secondary"
        on:click={() => {
          $editor.chain().focus().toggleUnderline().run();
        }}>Underline</Button
      >
      <Button
        size="sm"
        color="secondary"
        on:click={() => {
          $editor.chain().focus().undo().run();
        }}>Undo</Button
      >
      <Button
        size="sm"
        color="secondary"
        on:click={() => {
          $editor.chain().focus().redo().run();
        }}>Redo</Button
      >
      <EditorContent editor={$editor} />
      {#if $editor}<BubbleMenu editor={$editor} />{/if}
    </Col>
  </Row>
</Container>
