<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	export let mediaStream: MediaStream | null = null;
	export let onCapture: (image: ImageBitmap) => void;

	let canvas: HTMLCanvasElement;
	let video: HTMLVideoElement;
	let animationFrameId: number;

	const hasStream = writable(false);

	function drawFrame() {
		if (mediaStream && video.readyState >= 2 && canvas) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				ctx.drawImage(video, 0, 0);
			}
		}
		animationFrameId = requestAnimationFrame(drawFrame);
	}

	function handleClick() {
		if (!canvas) return;
		createImageBitmap(canvas).then(onCapture);
	}

	onMount(() => {
		video = document.createElement('video');
		video.autoplay = true;
		video.playsInline = true;
		video.srcObject = mediaStream || null;
		video.onloadedmetadata = () => {
			hasStream.set(true);
		};

		drawFrame();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	});

	$: {
		if (video && mediaStream !== video.srcObject) {
			video.srcObject = mediaStream || null;
		}
	}
</script>

<canvas bind:this={canvas} on:click={handleClick} style="width: 100%; height: auto; display: block;"
></canvas>
