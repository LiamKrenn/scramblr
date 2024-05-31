<script lang="ts">
	import { new_scramble } from '$lib/scramble';
	import { timeToFormattedString } from '$lib/utils';

	const SPACEBAR_KEYCODE = 32;
	const READY_DELAY = 300;
	const TIMER_UPDATE_INTERVAL = 100;
	const TIMER_UPDATE_DECIMALS = 1;
	const TIMER_DECIMALS = 3;

	let start_time = 0;
	let display_time = '0.0';
	let key_down = 0;
	let ready = false;
	let timerInterval: NodeJS.Timeout;

	export let time = 0;
  export let in_solve = false;

	$: if (start_time != 0) {
    in_solve = true;
		startTimerUpdate();
	} else {
		stopTimerUpdate();
    in_solve = false;
	}

	function startTimerUpdate() {
		timerInterval = setInterval(() => {
			display_time = timeToFormattedString((Date.now() - start_time), TIMER_UPDATE_DECIMALS);
		}, TIMER_UPDATE_INTERVAL);
	}

	function stopTimerUpdate() {
		clearInterval(timerInterval);
	}

	async function onKeyDown(e: KeyboardEvent) {
		if (e.keyCode == SPACEBAR_KEYCODE) {
			await onMouseDown();
		}
	}

	async function onKeyUp(e: KeyboardEvent) {
		if (e.keyCode == SPACEBAR_KEYCODE) {
			await onMouseUp();
		}
	}

	let mousedown = false;

	async function onMouseDown() {
		mousedown = true;

		if (key_down == 0 && start_time == 0) {
			key_down = Date.now();
		} else if (key_down != 0 && start_time == 0 && Date.now() - key_down > READY_DELAY) {
			ready = true;
      in_solve = true;
			display_time = '0.0';
			time = 0;
		} else if (start_time != 0) {
      let msecs = Date.now() - start_time;
			display_time = timeToFormattedString(msecs, TIMER_DECIMALS);
			time = msecs;
			start_time = 0;
			await new_scramble();
		}
	}

	let intervalId: NodeJS.Timeout;
	$: if (mousedown) {
		intervalId = setInterval(onMouseDown, 50);
	} else {
		clearInterval(intervalId);
	}

	async function onMouseUp() {
		mousedown = false;
		if (key_down != 0) {
			if (Date.now() - key_down > READY_DELAY) {
				start_time = Date.now();
				ready = false;
			}
			key_down = 0;
		}
	}
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} on:keyup|preventDefault={onKeyUp} />

<div on:touchstart={onMouseDown} on:touchend={onMouseUp} class="absolute z-10 h-full w-full" />

<div class="z-0 my-4 flex relative h-full w-full grow cursor-default items-center justify-center">
	{#if ready}
		<p class="text-6xl text-green-500 lg:text-8xl">{display_time}</p>
	{:else if key_down != 0 && !ready}
		<p class="text-6xl text-red-600 lg:text-8xl">{display_time}</p>
	{:else}
		<p class="text-6xl lg:text-8xl">{display_time}</p>
	{/if}
</div>
