<script lang="ts">
	import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
	import { doc, updateDoc, deleteField } from 'firebase/firestore';
	import { storage, db } from '../firebase';
	import { Input, Button } from 'flowbite-svelte';
	import { toasts } from 'svelte-toasts';
	import type { Readable } from 'svelte/store';
	import type User from '../../types/model/user';
	import { getContext } from 'svelte';

	export let id: string;
	export let media: string;

	let me: Readable<User> = getContext('me');
	let file: Blob;

	function loadFile(e: Event) {
		const t = e.target as HTMLInputElement;
		file = t.files[0];
		const reader = new FileReader();

		const button = document.getElementById('upload') as HTMLInputElement;
		button.disabled = false;
		button.color = 'green';

		reader.onload = () => {
			if (reader.result === '') {
				button.disabled = true;
				toasts.error('File empty or too large?');
				return;
			}

			// rules on cloud storage only allow audio, but catch here first if possible
			if (!file.type.startsWith('audio/')) {
				button.disabled = true;
				toasts.error('media must be an audio file');
				return;
			}

			button.disabled = false;
			button.color = 'green';
			// toasts.success("ready to upload");
		};
		reader.onerror = (error) => {
			console.log(error, file);
			button.disabled = true;
			button.color = 'yellow';
			toasts.error('could not load file', file.name);
		};

		reader.readAsBinaryString(file);
	}

	function doUpload() {
		if (!file.type.includes('audio')) {
			toasts.error('must be an audio file', file.type);
			return;
		}

		if (file.size > 10485760) {
			toasts.error('Too large: (10MB limit)', (file.size / 1048576).toString());
			return;
		}

		let progressBarString: string = 'starting';
		const progressBar = toasts.success('Uploading', progressBarString, {
			duration: 0
		});

		const mediaRef = ref(storage, 'media/' + id);
		const metadata = { contentType: file.type };
		let paused = false;

		try {
			const uploadTask = uploadBytesResumable(mediaRef, file, metadata);
			progressBar.onClick = () => {
				console.log('progressBar clicked');
				if (paused) {
					uploadTask.resume();
				} else {
					uploadTask.pause();
				}
			};

			progressBar.onRemove = () => {
				console.log('progressBar removed');
				uploadTask.cancel();
			};

			// onClick handler to pause/resume

			uploadTask.on(
				'state_changed',
				(snapshot) => {
					switch (snapshot.state) {
						case 'paused':
							progressBar.update({ title: 'Paused' });
							progressBar.type = 'warning';
							console.debug('Upload is paused');
							paused = true;
							break;
						case 'running':
							if (snapshot.bytesTransferred > 0) {
								let progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
								progressBarString = progressPercent.toFixed(1) + '% done';
							}
							progressBar.update({
								title: 'Uploading',
								description: progressBarString
							});
							progressBar.type = 'success';
							paused = false;
							break;
					}
				},
				(error) => {
					console.error(error);
					progressBar.remove();
					toasts.error(error.message, 'upload failed (on)', {
						uid: 70,
						duration: 0
					});
				},
				() => {
					console.debug('successfully uploaded');
					progressBar.remove();
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						media = downloadURL;
						console.debug('File available at', media);
						toasts.success('File Uploaded', { uid: 71 });
						updateDoc(doc(db, 'prayers', id), { Media: media });
					});
				}
			);
		} catch (error: Error) {
			console.error(error);
			progressBar.remove();
			toasts.error(error.message, 'upload failed (try)', {
				uid: 74,
				duration: 0
			});
		}
	}

	async function removeMedia() {
		try {
			await deleteObject(ref(storage, 'media/' + id));
			await updateDoc(doc(db, 'prayers', id), { Media: deleteField() });
			media = null;
		} catch (error: Error) {
			console.log(error);
			toasts.error(error.message, id, { uid: 72 });
		}
		const button = document.getElementById('upload') as HTMLInputElement;
		button.disabled = true;
		button.color = 'yellow';
	}
</script>

<div class="grid grid-flow-row-dense grid-cols-4">
	<div class="col-span-4">
		&nbsp;
		{#if media}
			<audio controls><source src={media} /></audio>
		{/if}
	</div>
	{#if $me.isMediaManager}
		<div class="col-span-4">
			<Input type="file" name="file" id="fileData" onchange={loadFile} />
		</div>
		<div class="col-span-2">
			<Button disabled={true} color="yellow" id="upload" onclick={doUpload}>Upload</Button>
		</div>
		<div class="col-span-2">
			<Button disabled={!media} color="red" id="remove" onclick={removeMedia}>Remove</Button>
		</div>
	{/if}
</div>
