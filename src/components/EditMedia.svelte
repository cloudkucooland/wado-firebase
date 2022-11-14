<script>
  import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
  } from "firebase/storage";
  import { doc, updateDoc, deleteField } from "firebase/firestore";
  import { storage, db } from "../firebase";
  import { Input, Button, Row, Col } from "sveltestrap";
  import { toasts } from "svelte-toasts";

  export let id;
  export let media;

  let file;

  function loadFile(e) {
    file = e.target.files[0];
    const reader = new FileReader();

    const button = document.getElementById("upload");
    button.disabled = false;

    reader.onload = () => {
      if (reader.result === "") {
        button.disabled = true;
        toasts.error("File empty or too large?");
        return;
      }

      // rules on cloud storage only allow audio, but catch here first if possible
      if (!file.type.startsWith("audio/")) {
        button.disabled = true;
        toasts.error("media must be an audio file");
        return;
      }

      button.disabled = false;
      // toasts.success("ready to upload");
    };
    reader.onerror = (error) => {
      console.log(error, file);
      button.disabled = true;
      toasts.error("could not load file", file.name);
    };

    reader.readAsBinaryString(file);
  }

  function doUpload() {
    let progressBarString = "starting";
    const progressBar = toasts.success("Uploading", progressBarString, {
      duration: 0,
    });

    const mediaRef = ref(storage, "media/" + id);
    const metadata = { contentType: file.type };
    let paused = false;

    try {
      const uploadTask = uploadBytesResumable(mediaRef, file, metadata);
      progressBar.onClick = () => {
        console.log("progressBar clicked");
        if (paused) {
          uploadTask.resume();
        } else {
          uploadTask.pause();
        }
      };

      progressBar.onRemove = () => {
        console.log("progressBar removed");
        uploadTask.cancel();
      };

      // onClick handler to pause/resume

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              progressBar.update({ title: "Paused" });
              progressBar.type = "warning";
              console.debug("Upload is paused");
              paused = true;
              break;
            case "running":
              if (snapshot.bytesTransferred > 0) {
                let progressPercent =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBarString = progressPercent.toFixed(1) + "% done";
              }
              progressBar.update({
                title: "Uploading",
                description: progressBarString,
              });
              progressBar.type = "success";
              paused = false;
              break;
          }
        },
        (error) => {
          console.error(error);
          progressBar.remove();
          toasts.error(error.message, "upload failed (on)", {
            uid: 70,
            duration: 0,
          });
        },
        () => {
          console.debug("successfully uploaded");
          progressBar.remove();
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            media = downloadURL;
            console.debug("File available at", media);
            toasts.success("File Uploaded", { uid: 71 });
            updateDoc(doc(db, "prayers", id), { Media: media });
          });
        }
      );
    } catch (error) {
      console.error(error);
      progressBar.remove();
      toasts.error(error.message, "upload failed (try)", {
        uid: 74,
        duration: 0,
      });
    }
  }

  async function removeMedia() {
    try {
      await deleteObject(ref(storage, "media/" + id));
      await updateDoc(doc(db, "prayers", id), { Media: deleteField() });
      media = false;
    } catch (error) {
      console.log(error);
      toasts.error(error.message, id, { uid: 72 });
    }
  }
</script>

<Row>
  <Col sm="4"
    >&nbsp;
    {#if media}
      <audio controls><source src={media} /></audio>
    {/if}
  </Col>
  <Col sm="4">
    <Input type="file" name="file" id="fileData" on:change={loadFile} />
  </Col>
  <Col sm="2">
    <Button disabled="true" color="primary" id="upload" on:click={doUpload}>
      Upload
    </Button>
  </Col>
  <Col sm="2">
    <Button
      disabled={!media}
      color="warning"
      id="remove"
      on:click={removeMedia}
    >
      Remove
    </Button>
  </Col>
</Row>
