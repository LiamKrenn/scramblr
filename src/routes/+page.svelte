<script lang="ts">
  import ScramblePreview from "$lib/components/scramble-preview.svelte";
  import ScrambleSelector from "$lib/components/scramble-selector.svelte";
  import Timer from "$lib/components/timer.svelte";
  import { new_scramble, scramble } from "$lib/scramble";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Menu from "$lib/components/menu.svelte";
  import { get } from "svelte/store";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import TimeItem from "$lib/components/time-item.svelte";
  import TimePopup from "$lib/components/time-popup.svelte";
  import SessionSelector from "$lib/components/session-selector.svelte";
  import { RefreshCw } from "lucide-svelte";
  import VirtualList from "svelte5-tiny-virtual-list";
  import { mediaQuery } from "@sveltelegos-blue/svelte-legos";
  import { getUUID, timeToFormattedString } from "$lib/utils";
  import { browser } from "$app/environment";
  import { currentSession, sessions, times, token, user } from "$lib/stores";
  import { type Time } from "$lib/types";
  import { createTime } from "$lib/db";
  import { initSync, pg } from "$lib/pglite";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let time = $state(0);
  let in_solve = $state(false);

  let lowest_ao5 = $state(-1);
  let lowest_ao12 = $state(-1);
  let lowest_ao100 = $state(-1);

  async function solve_done() {
    let time_json: Time = {
      id: getUUID(),
      time: time,
      scramble: $scramble,
      session_id: $currentSession,
      penalty: 0,
      timestamp: new Date().toISOString().replace("T", " ").replace("Z", ""),
    };

    let res = await createTime(time_json);

    console.log(res);

    // fetching.set(true);
    // sync.createTime(time_json);
    // time = 0;
    // if (logged_in) {
    // }
    // fetching.set(false);
  }

  let time_popup: TimePopup;

  async function openTimePopup(id: Time, index: number) {
    time_popup.openTimePopup(id, index);
  }

  onMount(async () => {
    await new_scramble();
    if (!browser) return;
    $user = data.user;
    $token = data.token || null;
    if ($token && $user) {
      if ($currentSession === undefined) {
        // let ses = await triplit.fetch(triplit.query("sessions").build());
        // if (ses.length == 0) {
        //   const res = await triplit.insert("sessions", {
        //     order: 1,
        //     name: "Default",
        //     user_id: $user.id,
        //     scramble_type: "333",
        //   });
        //   if (!res.output) return;
        //   $currentSession = res.output.id;
        // } else {
        //   $currentSession = ses[0].id;
        // }
      }
    }

    await pg.waitReady;
    await initSync();
  });

  let listHeight = $state(100);
  const isDesktopTimes = mediaQuery("(min-width: 1436px)");

  function calc_aon(
    index: number,
    aon: number,
    remove_top_bottom_count: number,
  ) {
    let ao_times = $times.slice(index, index + aon);
    if (ao_times.length < aon) {
      return -1;
    }
    ao_times.sort((a, b) => a.time - b.time);
    for (let i = 0; i < remove_top_bottom_count; i++) {
      ao_times.pop();
      ao_times.shift();
    }
    const sum = ao_times.reduce((total, time) => total + time.time, 0);
    return sum / ao_times.length;
  }

  function calc_ao5(index: number) {
    return calc_aon(index, 5, 1);
  }

  function calc_ao12(index: number) {
    return calc_aon(index, 12, 1);
  }

  function calc_ao100(index: number) {
    return calc_aon(index, 100, 5);
  }

  // let times = $derived(
  //   liveQuery(async () => {
  //     fetching.set(true);
  //     const res = await sync.db.times
  //       .where("session_id")
  //       .equals($session_id)
  //       .and((time) => time.archived != true)
  //       .reverse()
  //       .sortBy("timestamp");
  //     time_count = await sync.getTimeCountOfSession($session_id);
  //     fetching.set(false);
  //     return res;
  //   }),
  // );
  // $effect(() => {
  //   if ($times && $session_id) {
  //     lowest_ao5 = -1;
  //     lowest_ao12 = -1;
  //     lowest_ao100 = -1;
  //     let i = 0;
  //     $times.forEach((time_el) => {
  //       let temp5 = calc_ao5(i);
  //       let temp12 = calc_ao12(i);
  //       let temp100 = calc_ao100(i);
  //       if (lowest_ao5 == -1 || (temp5 != -1 && temp5 < lowest_ao5)) {
  //         lowest_ao5 = temp5;
  //       }
  //       if (lowest_ao12 == -1 || (temp12 != -1 && temp12 < lowest_ao12)) {
  //         lowest_ao12 = temp12;
  //       }
  //       if (lowest_ao100 == -1 || (temp100 != -1 && temp100 < lowest_ao100)) {
  //         lowest_ao100 = temp100;
  //       }
  //       i += 1;
  //     });
  //   }
  // });

  async function timeCallback(time: number) {
    if (!$currentSession) return;
    console.log("time", time);

    // triplit.insert("times", {
    //   time: time,
    //   scramble: $scramble,
    //   session_id: $currentSession,
    //   user_id: data.user?.id ?? 1,
    // });
    await solve_done();
  }
</script>

<TimePopup bind:this={time_popup} />

<button
  class="relative flex h-full w-full cursor-default select-none flex-col items-center justify-center"
>
  {#if !in_solve}
    <!-- Absolutes -->

    <Menu user={data.user} />
    <ScrambleSelector />

    <div
      class="scrambleContainer absolute top-20 block h-[20%] w-full text-balance px-4 text-center lg:top-4 lg:px-28"
    >
      {#if $scramble.length > 270}
        <p class="scramble text-balance text-[clamp(1rem,2.8cqmin,3.9rem)]">
          {$scramble}
        </p>
      {:else if $scramble.length > 170}
        <p class="scramble text-balance text-[clamp(1.2rem,3.2cqmin,4rem)]">
          {$scramble}
        </p>
      {:else if $scramble.length > 100}
        <p class="scramble text-balance text-[clamp(1.5rem,5cqmin,4.1rem)]">
          {$scramble}
        </p>
      {:else if $scramble.length > 50}
        <p class="scramble text-balance text-[clamp(2rem,6cqmin,4.3rem)]">
          {$scramble}
        </p>
      {:else}
        <p class="scramble text-balance text-[clamp(2.5rem,7cqmin,4.5rem)]">
          {$scramble}
        </p>
      {/if}
    </div>

    <h1
      class=" absolute left-4 top-4 flex cursor-pointer select-none flex-col items-start text-3xl lg:hidden lg:text-4xl lg:text-5xl"
    >
      <p class=" font-semibold opacity-90">scramblr</p>

      <a
        class="!z-20 text-sm opacity-75 lg:text-base lg:mt-1"
        href="https://github.com/LiamKrenn"
        target="_blank"
      >
        by
        <span class="underline"> Liam Krenn </span>
      </a>
    </h1>
    <!-- Flex's -->
  {/if}

  <Timer bind:time bind:in_solve {timeCallback} />

  <div
    class="absolute mt-2 flex h-[49%] w-full max-w-[40%] flex-col items-center justify-end sm:h-[33%] {in_solve
      ? '-z-20 opacity-0'
      : 'z-0'}"
  >
    <!-- {#if !logged_in}
      <div class="relative w-max rounded-lg bg-slate-800 py-1 px-2">
        <p>
          <a class="underline" href="/login">Log in</a> to save your times in the cloud!
        </p>
      </div>
    {/if} -->
    <!-- <p class="text-balance rounded-lg bg-orange-500/50 px-2 py-1">
      Warning: This app is being reworked heavily right now!<br /> Some features
      may be broken or missing. <br />Expect things to&nbsp;<span
        class="underline">not</span
      >&nbsp;work.
    </p> -->
    <p class="relative flex text-balance rounded-lg bg-slate-800 px-2 py-1">
      Note: Cloud storage is in development, but enabled. Expect data loss.
    </p>
  </div>

  <div
    class="absolute bottom-0 h-[25%] w-full text-center sm:h-[33%] {in_solve
      ? '-z-20 opacity-0'
      : 'z-10'}"
  >
    <div class="absolute flex w-full flex-col items-center px-2 lg:px-3">
      <Separator class="my-1 h-0.5 rounded" />
    </div>
    <!-- UI -->
    <div
      class="absolute z-20 mt-2 flex h-full w-full grow flex-row px-0 py-1 lg:px-1"
    >
      <!-- Left (Times) -->
      <div class="relative ml-2 flex w-full flex-1 shrink-0 grow flex-col">
        <!-- {#if $fetching} old spinner
					<div class="absolute inline-block w-full">
						<span class="loader"></span>
					</div>
				{/if} -->
        <div class="mb-1.5 flex items-center justify-start">
          <p class="ml-1 mr-2 hidden text-sm xs:flex 2xl:text-base">Session</p>
          <SessionSelector />
        </div>
        <!-- {#if $fetching} new spinner
          <RefreshCw
            class="absolute right-1 top-0 animate-spin p-0.5 2xl:top-1 2xl:p-0"
          />
        {/if} -->
        {#if $times?.length > 0}
          <!--  -->
          <div class="h-full" bind:clientHeight={listHeight}>
            <VirtualList
              height={listHeight}
              itemCount={$times.length}
              itemSize={$isDesktopTimes ? 32 : 20}
            >
              {#snippet header()}
                <div
                  class="text-[10px] font-normal xs:text-xs 2xl:h-[32px] 2xl:text-lg"
                >
                  <Separator />
                  <div
                    class="flex h-[20px] w-full items-center justify-start rounded-none p-0 2xl:h-[32px]"
                  >
                    <Separator orientation="vertical" />
                    <p
                      class="flex w-12 items-center justify-center rounded-none p-0 2xl:w-20"
                    >
                      #
                    </p>
                    <Separator orientation="vertical" />
                    <p
                      class="flex h-[20px] flex-1 grow items-center justify-center rounded-none p-0"
                    >
                      Time
                    </p>
                    <Separator orientation="vertical" />
                    <p
                      class="flex h-[20px] flex-1 grow items-center justify-center rounded-none p-0"
                    >
                      ao5
                    </p>
                    <Separator orientation="vertical" />
                    <p
                      class="flex h-[20px] flex-1 grow items-center justify-center rounded-none p-0"
                    >
                      ao12
                    </p>
                    <Separator orientation="vertical" />
                    <p
                      class="flex h-[20px] flex-1 grow items-center justify-center rounded-none p-0"
                    >
                      ao100
                    </p>
                    <Separator orientation="vertical" />
                  </div>
                  <Separator class="h-0.5" />
                </div>
              {/snippet}
              {#snippet children({ index, style })}
                {#if $times[index]}
                  <div {style}>
                    <TimeItem
                      time={$times[index]}
                      {openTimePopup}
                      {index}
                      time_count={$times.length}
                      ao5={calc_ao5(index)}
                      ao12={calc_ao12(index)}
                      ao100={calc_ao100(index)}
                    />
                    <Separator />
                  </div>
                {/if}
              {/snippet}
              {#snippet footer()}
                <div></div>
              {/snippet}
            </VirtualList>
          </div>
        {:else}
          <div
            class="mr-1.5 text-[10px] font-normal xs:text-xs 2xl:h-[32px] 2xl:text-lg"
          >
            <Separator />
            <div
              class="flex h-[20px] w-full items-center justify-start rounded-none p-0 2xl:h-[32px]"
            >
              <Separator orientation="vertical" />
              <p
                class="flex w-12 items-center justify-center rounded-none p-0 2xl:w-20"
              >
                #
              </p>
              <Separator orientation="vertical" />
              <p
                class="flex h-[20px] flex-1 grow items-center justify-center rounded-none p-0"
              >
                Time
              </p>
              <Separator orientation="vertical" />
              <p
                class="flex h-[20px] flex-1 grow items-center justify-center rounded-none p-0"
              >
                ao5
              </p>
              <Separator orientation="vertical" />
              <p
                class="flex h-[20px] flex-1 grow items-center justify-center rounded-none p-0"
              >
                ao12
              </p>
              <Separator orientation="vertical" />
              <p
                class="flex h-[20px] flex-1 grow items-center justify-center rounded-none p-0"
              >
                ao100
              </p>
              <Separator orientation="vertical" />
            </div>
            <Separator class="h-0.5" />
          </div>
        {/if}
      </div>

      <Separator class="mx-1 grow-0 rounded" orientation="vertical" />

      <!-- Middle -->

      <div class="hidden w-full flex-1 grow flex-col lg:flex">
        <!-- Stats -->
        <div class="w-full grow px-2">
          {#if lowest_ao5 != -1}
            <p>best ao5: {timeToFormattedString(lowest_ao5)}</p>
          {/if}
          {#if lowest_ao12 != -1}
            <p>best ao12: {timeToFormattedString(lowest_ao12)}</p>
          {/if}
          {#if lowest_ao100 != -1}
            <p>best ao100: {timeToFormattedString(lowest_ao100)}</p>
          {/if}
        </div>

        <!-- Logo -->
        <h1
          class="lslogos mb-0 flex w-full grow-0 cursor-pointer select-none items-end justify-center"
        >
          <p class=" font-semibold opacity-90">scramblr</p>

          <a
            class="lslogob !z-20 mb-[0.5cqb] ml-2 opacity-75"
            href="https://github.com/LiamKrenn"
            target="_blank"
          >
            by
            <span class="underline"> Liam Krenn </span>
          </a>
        </h1>
      </div>
      <Separator
        class="mx-1 hidden grow-0 rounded lg:flex"
        orientation="vertical"
      />

      <!-- Right -->
      <div class="flex w-full flex-1 grow-[0.5] flex-col sm:grow-[0.8] lg:grow">
        <!-- Preview -->
        <!-- TODO: on click enlarge -->
        <ScramblePreview
          class="h-[30%] min-h-[30%] w-full grow-0 p-0 lg:mb-2 lg:h-full"
        />

        <!-- Stats -->
        <div
          class="flex flex-col text-sm w-full grow items-start p-2 lg:hidden"
        >
          {#if lowest_ao5 != -1}
            <p>best ao5: {timeToFormattedString(lowest_ao5)}</p>
          {/if}
          {#if lowest_ao12 != -1}
            <p>best ao12: {timeToFormattedString(lowest_ao12)}</p>
          {/if}
          {#if lowest_ao100 != -1}
            <p>best ao100: {timeToFormattedString(lowest_ao100)}</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</button>

<style>
  .lslogos {
    font-size: clamp(1rem, 3cqmin, 3.5rem);
  }
  .lslogob {
    font-size: clamp(0.7rem, 1.5cqmin, 2rem);
  }

  :global(.virtual-list-wrapper) {
    @apply pb-2 pr-1;
  }

  :global(.virtual-list-wrapper::-webkit-scrollbar) {
    @apply w-[2px];
  }
  :global(.cscroll::-webkit-scrollbar) {
    @apply w-[2px];
  }
  :global(.virtual-list-wrapper::-webkit-scrollbar-thumb) {
    @apply h-8 rounded-full bg-slate-700;
  }
  :global(.cscroll::-webkit-scrollbar-thumb) {
    @apply h-8 rounded-full bg-slate-700;
  }

  .loader {
    @apply !z-30  h-1;
    width: 100%;
    display: inline-block;
    overflow: hidden;
  }
  .loader::after {
    @apply !z-30 h-[1px] rounded-full bg-slate-500;
    content: "";
    width: 42px;
    position: absolute;
    top: 0px;
    left: 0;
    box-sizing: border-box;
    animation: hitZak 0.6s ease-in-out infinite alternate;
  }

  @keyframes hitZak {
    0% {
      left: 1px;
      transform: translateX(0%);
    }
    100% {
      left: calc(100% - 7px);
      transform: translateX(-100%);
    }
  }
</style>
