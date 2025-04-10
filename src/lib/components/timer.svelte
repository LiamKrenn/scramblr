<script lang="ts">
  import { new_scramble } from "$lib/scramble";
  import { disable_key_tracking, timeToFormattedString } from "$lib/utils";

  const SPACEBAR_KEYCODE = 32;
  const READY_DELAY = 300;
  const TIMER_UPDATE_INTERVAL = 100;
  const TIMER_UPDATE_DECIMALS = 1;
  const TIMER_DECIMALS = 3;

  let start_time = $state(0);
  let display_time = $state("0.0");
  let key_down = $state(0);
  let ready = $state(false);
  let timerInterval: NodeJS.Timeout;

  interface Props {
    time?: number;
    in_solve?: boolean;
    timeCallback?: (time: number) => void;
  }

  let {
    time = $bindable(0),
    in_solve = $bindable(false),
    timeCallback = () => {},
  }: Props = $props();

  function startTimerUpdate() {
    timerInterval = setInterval(() => {
      display_time = timeToFormattedString(
        Date.now() - start_time,
        TIMER_UPDATE_DECIMALS,
      );
    }, TIMER_UPDATE_INTERVAL);
  }

  function stopTimerUpdate() {
    clearInterval(timerInterval);
  }

  async function onKeyDown(e: KeyboardEvent) {
    if ($disable_key_tracking) return;
    if (e.keyCode == SPACEBAR_KEYCODE) {
      await onMouseDown();
    }
  }

  async function onKeyUp(e: KeyboardEvent) {
    if (e.keyCode == SPACEBAR_KEYCODE) {
      await onMouseUp();
    }
  }

  let mousedown = $state(false);

  async function onMouseDown() {
    mousedown = true;

    if (key_down == 0 && start_time == 0) {
      key_down = Date.now();
    } else if (
      key_down != 0 &&
      start_time == 0 &&
      Date.now() - key_down > READY_DELAY
    ) {
      ready = true;
      in_solve = true;
      display_time = "0.0";
      time = 0;
    } else if (start_time != 0) {
      let msecs = Date.now() - start_time;
      display_time = timeToFormattedString(msecs, TIMER_DECIMALS);
      time = msecs;
      start_time = 0;
      timeCallback(msecs);
      await new_scramble();
    }
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

  $effect(() => {
    if (start_time != 0) {
      in_solve = true;
      startTimerUpdate();
    } else {
      stopTimerUpdate();
      in_solve = false;
    }
  });
</script>

<svelte:window onkeydown={onKeyDown} onkeyup={onKeyUp} />

<div
  ontouchstart={onMouseDown}
  ontouchend={onMouseUp}
  class="absolute z-10 h-full w-full"
></div>

<div
  class="relative z-0 my-4 flex h-full w-full grow cursor-default items-center justify-center"
>
  {#if ready}
    <p class="text-6xl text-green-500 lg:text-8xl">{display_time}</p>
  {:else if key_down != 0 && !ready}
    <p class="text-6xl text-red-600 lg:text-8xl">{display_time}</p>
  {:else}
    <p class="text-6xl lg:text-8xl">{display_time}</p>
  {/if}
</div>
