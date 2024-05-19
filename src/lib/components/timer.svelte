<script lang="ts">
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

	$: if (start_time != 0) {
		startTimerUpdate();
	} else {
		stopTimerUpdate();
	}

	function timeToFormattedString(time: number, decimals: number) {
		let minutes = Math.floor(time / 60);
		let seconds = (time % 60).toFixed(decimals);
		if (minutes == 0) return seconds;
		if (parseFloat(seconds) < 10) seconds = '0' + seconds;
		return `${minutes}:${seconds}`;
	}

	function startTimerUpdate() {
		timerInterval = setInterval(() => {
			display_time = timeToFormattedString((Date.now() - start_time) / 1000, TIMER_UPDATE_DECIMALS);
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
			display_time = '0.0';
			time = 0;
		} else if (start_time != 0) {
			display_time = timeToFormattedString((Date.now() - start_time) / 1000, TIMER_DECIMALS);
			time = parseFloat(display_time);
			start_time = 0;
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

<svelte:window
	on:mousedown={onMouseDown}
  on:mouseup={onMouseUp}
	on:keydown|preventDefault={onKeyDown}
	on:keyup={onKeyUp}
  on:touchstart={onMouseDown}
  on:touchend={onMouseUp}
/>

{#if ready}
	<p class="text-8xl text-green-500">{display_time}</p>
{:else if key_down != 0 && !ready}
	<p class="text-8xl text-red-600">{display_time}</p>
{:else}
	<p class="text-8xl">{display_time}</p>
{/if}
