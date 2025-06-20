<script lang="ts">
	import { onMount } from 'svelte';

	export let onStream: (stream: MediaStream) => void;

	let devices: MediaDeviceInfo[] = [];
	let selectedDeviceId = '';
	let permissionGranted = false;

	const STORAGE_KEY = 'preferredCameraId';

	async function loadCameras() {
		try {
			// Ensure access for labels
			await navigator.mediaDevices.getUserMedia({ video: true });
			permissionGranted = true;

			const allDevices = await navigator.mediaDevices.enumerateDevices();
			devices = allDevices.filter((d) => d.kind === 'videoinput');

			// Try to restore previous selection
			const savedId = localStorage.getItem(STORAGE_KEY);
			if (savedId && devices.find((d) => d.deviceId === savedId)) {
				selectedDeviceId = savedId;
			} else if (devices.length > 0) {
				selectedDeviceId = devices[0].deviceId;
			}
		} catch (err) {
			console.error('Could not access cameras:', err);
			devices = [];
		}
	}

	async function startStream() {
		if (!selectedDeviceId) return;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { deviceId: { exact: selectedDeviceId } }
			});
			localStorage.setItem(STORAGE_KEY, selectedDeviceId);
			onStream(stream);
		} catch (err) {
			console.error('Error starting selected camera stream:', err);
		}
	}

	onMount(() => {
		loadCameras();
	});
</script>

{#if devices.length === 0}
	<p>No cameras available</p>
{:else}
	<select bind:value={selectedDeviceId}>
		{#each devices as device, i}
			<option value={device.deviceId}>
				{permissionGranted ? device.label || `Camera ${i + 1}` : `Camera ${i + 1}`}
			</option>
		{/each}
	</select>

	<button on:click={startStream}>Use Camera</button>
{/if}
