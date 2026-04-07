<script lang="ts">
	import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
	import { doc, updateDoc, deleteField } from 'firebase/firestore';
	import { storage, db } from '../firebase';
	import { Input, Button } from 'flowbite-svelte';
	import { toasts } from 'svelte-toasts';
	import { getContext } from 'svelte';
	import type { user } from '../model/user';

	// 1. Svelte 5 Props (bindable media)
	let { id, media = $bindable() } = $props<{ id: string; media: string | null }>();

	const userContext = getContext<{ details: user }>('me');

	// 2. Reactive UI State - No more getElementById!
	let file = $state<File | null>(null);
	let uploadDisabled = $state(true);
	let uploadColor = $state<'yellow' | 'green'>('yellow');

	function loadFile(e: Event) {
		const t = e.target as HTMLInputElement;
		if (!t.files || t.files.length === 0) return;

		const selectedFile = t.files[0];

		// Reset state
		uploadDisabled = true;
		uploadColor = 'yellow';

		// Quick type check
		if (!selectedFile.type.startsWith('audio/')) {
			toasts.error('Media must be an audio file');
			return;
		}

		// Use FileReader to validate it's readable
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.result === '') {
				toasts.error('File appears to be empty');
				return;
			}
			// Success: Enable the button via state
			file = selectedFile;
			uploadDisabled = false;
			uploadColor = 'green';
		};

		reader.onerror = () => {
			toasts.error('Could not load file', selectedFile.name);
		};

		reader.readAsArrayBuffer(selectedFile);
	}

	function doUpload() {
		if (!file) return;

		if (file.size > 10485760) {
			// 10MB
			toasts.error('Too large: (10MB limit)', (file.size / 1048576).toFixed(2) + 'MB');
			return;
		}

		const progressBar = toasts.success('Uploading', 'starting', { duration: 0 });
		const mediaRef = ref(storage, `media/${id}`);
		const metadata = { contentType: file.type };
		let paused = false;

		const uploadTask = uploadBytesResumable(mediaRef, file, metadata);

		// Reactive Toast interactions
		progressBar.onClick = () => {
			paused ? uploadTask.resume() : uploadTask.pause();
		};
		progressBar.onRemove = () => uploadTask.cancel();

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				switch (snapshot.state) {
					case 'paused':
						paused = true;
						progressBar.update({ title: 'Paused', type: 'warning' });
						break;
					case 'running':
						paused = false;
						progressBar.update({
							title: 'Uploading',
							description: `${progress.toFixed(1)}% done`,
							type: 'success'
						});
						break;
				}
			},
			(error) => {
				progressBar.remove();
				toasts.error(error.message, 'Upload failed');
			},
			async () => {
				progressBar.remove();
				const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

				// Update Local State and Firestore
				media = downloadURL;
				await updateDoc(doc(db, 'prayers', id), { Media: media });
				toasts.success('File Uploaded');

				// Reset upload button
				uploadDisabled = true;
				uploadColor = 'yellow';
			}
		);
	}

	async function removeMedia() {
		try {
			await deleteObject(ref(storage, `media/${id}`));
			await updateDoc(doc(db, 'prayers', id), { Media: deleteField() });
			media = null; // $bindable prop makes this update the parent too
			toasts.success('Media removed');
		} catch (error: any) {
			toasts.error(error.message);
		}
	}
</script>

<div class="grid grid-cols-4 gap-4 py-4">
	<div class="col-span-4">
		{#if media}
			<audio controls class="w-full">
				<source src={media} type="audio/mpeg" />
				Your browser does not support the audio element.
			</audio>
		{:else}
			<p class="text-center text-sm text-gray-500 italic">No audio attached to this prayer.</p>
		{/if}
	</div>

	{#if userContext.details.isMediaManager}
		<div class="col-span-4">
			<label class="mb-2 block text-sm font-medium text-gray-900" for="fileData">Upload Audio</label
			>
			<Input type="file" id="fileData" onchange={loadFile} accept="audio/*" />
		</div>

		<div class="col-span-2">
			<Button class="w-full" disabled={uploadDisabled} color={uploadColor} onclick={doUpload}>
				Upload
			</Button>
		</div>

		<div class="col-span-2">
			<Button class="w-full" disabled={!media} color="red" onclick={removeMedia}>
				Remove Existing
			</Button>
		</div>
	{/if}
</div>
