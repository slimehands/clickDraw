<script lang="ts">
	let mode: 'join' | 'create' | null = $state(null);
	let userName = $state('');
	let connected = $state(false);
	import { Timer } from '$lib/timer';
	const timer = new Timer();
	let camera: MediaStream | undefined = $state();
	let pic: ImageBitmap | undefined = $state();
	let playerState:
		| 'menu'
		| 'camera select'
		| 'waiting'
		| 'ready'
		| 'set'
		| 'go'
		| 'clicked'
		| 'done' = $state('camera select');
	import Camera from '$lib/Camera.svelte';
	import SelectCam from '$lib/selectCam.svelte';
	import type { gameFace, playerFace } from '$lib/utility';
	import { Host } from '$lib/host';
	import { readonly } from 'svelte/store';
	import { NonHost } from '$lib/nonHost';
	let events: String[] = $state([]);
	let gameCode: number | null = $state(Math.floor(2000 + 8000 * Math.random()));
	let player: gameFace | undefined = $state();
	let winner: null | string = $state(null);
	let winnerTime: null | number = $state(null);
	const on: playerFace['on'] = {
		set: (arg0: number) => {
			console.log('we are set, with ' + arg0 + ' to go');
			setTimeout(() => {
				playerState = 'go';
				timer.start();
			}, arg0);
		},
		event: (e: any) => {
			console.log(e);
		},
		again: () => (playerState = 'waiting'),

		done: (userName: string, time: number) => {
			winner = userName
			winnerTime = time;
			playerState = 'done'
		}
	};
	globalThis.seePlayer = () => {
		return player;
	};
	async function start() {
		if (gameCode) {
			if (mode == 'create') {
				player = new Host({ userName, gameCode, on });
			} else {
				player = new NonHost({ userName, gameCode, on });
			}
		}

		playerState = 'camera select';
		connected = true;
	}
</script>

{#if !mode}
	<button onclick={() => (mode = 'create')}>Create Game</button>
	<button
		onclick={() => {
			mode = 'join';
			gameCode = null;
		}}>Join Game</button
	>
{:else if !connected}
	<input bind:value={userName} placeholder="Username" />
	{#if mode == 'join'}
		<input type="number" bind:value={gameCode} placeholder="Game Code" />
	{:else}
		{gameCode}
	{/if}
	<button onclick={start}>Go</button>
{:else}
	<h2>{mode === 'create' ? 'Hosting' : 'Joined'} Game {gameCode}</h2>

	{#if playerState == 'camera select'}
		<SelectCam
			onStream={(cam) => {
				camera = cam;
				playerState = 'waiting';
			}}
		/>
	{:else if playerState == 'waiting'}
		<button
			onclick={() => {
				console.log('reading up!'), player.ready(), (playerState = 'set');
			}}
		>
			Ready up</button
		>
	{:else if playerState == 'ready'}
		You are ready! Still waiting on others
	{:else if playerState == 'set'}
		Wait for the vibration!!!
	{:else if playerState == 'go'}
		<h1 style="background-color: green;">CLICK!!!!</h1>
		<Camera
			mediaStream={camera}
			onCapture={(image) => {
				pic = image;
				let time = timer.stop();
				playerState = 'clicked';
				player.click(time);
			}}
		/>
	{:else if playerState == 'clicked'}
		waiting on others
	{:else if playerState == 'done'}
		
  {#if userName == winner}
  You won with {winnerTime} seconds
  {:else}
  the winner was {winner} with {winnerTime} seconds
  {/if}
  

		<button onclick={() => (playerState = 'waiting')}> play again? </button>
	{/if}
	<ul>
		{#each events as event}
			<li>{event}</li>
		{/each}
	</ul>
{/if}
