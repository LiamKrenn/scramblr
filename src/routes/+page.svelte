<script lang="ts">
	import ScramblePreview from '$lib/components/scramble-preview.svelte';
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
	import Timer from '$lib/components/timer.svelte';
	import { new_scramble, scramble, session_id, times } from '$lib/scramble';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Menu from '$lib/components/menu.svelte';
	import type {  TimeJson } from '$lib/types';
	import { get } from 'svelte/store';
	import { get_sessions, post_time, sync_times, sync_times_of_current_session, timeToFormattedString } from '$lib/utils';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import TimeItem from '$lib/components/time-item.svelte';
	import TimePopup from '$lib/components/time-popup.svelte';
	import SessionSelector from '$lib/components/session-selector.svelte';

	export let data: PageData;

	let time = 0;
	let in_solve = false;

	$: if (time) {
		let time_json: TimeJson = {
			_id: '0',
			user_id: '0',
			time: {
				penalty: 0,
				time: time
			},
			scramble: $scramble,
			comment: '',
			timestamp: Date.now(),
      session_id: get(session_id)
		};

		if (logged_in) {
			post_time(time_json);
		}

		time = 0;
	}

	let time_popup: TimePopup;
	onMount(async () => {
		await new_scramble();
		if (logged_in) {
      if (get(session_id) == '') {
        let sessions = await get_sessions();
        session_id.set(sessions[0]._id);
      }
			const res = await fetch('/api/times');
			const json = await res.json();
			times.set(json);
		}
	});

	$: logged_in = data.user !== null;

	$: if (logged_in) {
		const interval = setInterval(function () {
			console.log('syncing times');
			sync_times_of_current_session();
		}, 5000);
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
			class="scrambleContainer absolute top-20 block h-[20%] w-full text-balance px-4 text-center md:top-4 md:px-28"
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

		<!-- <div
		id="scrambleContainer"
		class="absolute top-20 !-z-10 block h-[32%] max-h-[32%] justify-center text-balance text-center text-3xl !leading-[125%] md:top-4 md:mx-36"
	>
		<div  class="flex h-full items-center">
			<p class="w-full cursor-default select-none px-4" id="scramble">
				{$scramble}
			</p>
		</div>
	</div> -->

		<h1
			class=" absolute left-4 top-4 flex cursor-pointer select-none flex-col items-start text-3xl md:hidden md:text-4xl lg:text-5xl"
		>
			<p class=" font-semibold opacity-90">scramblr</p>

			<a
				class="!z-20 text-sm opacity-75 md:text-base lg:mt-1"
				href="https://github.com/LiamKrenn"
				target="_blank"
			>
				by
				<span class="underline"> Liam Krenn </span>
			</a>
		</h1>
		<!-- Flex's -->
	{/if}

	<Timer bind:time bind:in_solve />

	{#if !in_solve}
		<div class="absolute bottom-0 h-[25%] w-full text-center sm:h-[33%]">
			<div class="w-full px-4">
				<Separator class="my-1 h-0.5 rounded xl:h-1" />
			</div>
			<!-- UI -->
			<div class="absolute z-20 flex h-full w-full grow flex-row p-2">
				<!-- Left -->
				<div class="flex w-full flex-col pl-2 relative">
          <div class="absolute top-0 right-2 flex items-center">
            <SessionSelector />
          </div>
          <div class="flex items-center justify-center w-full h-8 mb-2">
            <h1 class="font-semibold text-xl">Times</h1>
          </div>
					<ScrollArea class="!w-full grow overflow-y-auto  ">
						{#if $times.length > 0}
							{#each $times as time}
								{#if time_popup != undefined}
									<TimeItem {time} openTimePopup={time_popup.openTimePopup} />
								{/if}
							{/each}
						{/if}
					</ScrollArea>
				</div>

				<Separator class="mx-1 grow-0 rounded" orientation="vertical" />

				<!-- Middle -->

				<div class="hidden w-full grow flex-col items-center md:flex">
					<!-- Stats -->
					<div class="w-full grow">
						{#if !logged_in}
							<div class="mx-2 rounded-lg bg-slate-800 p-2">
								<p>
									<a class="underline" href="/login">Log in</a> to save your times in the cloud!
								</p>
							</div>
						{/if}
					</div>

					<!-- Logo -->
					<h1
						class="lslogos mb-1 flex w-full grow-0 cursor-pointer select-none items-end justify-center"
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
				<Separator class="mx-1 hidden grow-0 rounded md:flex" orientation="vertical" />

				<!-- Right -->
				<div class="flex w-full grow flex-col">
					<!-- Preview -->
					<ScramblePreview class="h-[30%] min-h-[30%] w-full grow-0 p-0 md:h-full" />

					<!-- Stats -->
					<div class="flex w-full grow md:hidden">
            {#if !logged_in}
							<div class="mx-2 rounded-lg bg-slate-800 p-2">
								<p>
									<a class="underline" href="/login">Log in</a> to save your times in the cloud!
								</p>
							</div>
						{/if}
          </div>
				</div>
			</div>
		</div>
	{/if}
</button>

<style>
	.lslogos {
		font-size: clamp(1rem, 3cqmin, 3.5rem);
	}
	.lslogob {
		font-size: clamp(0.7rem, 1.5cqmin, 2rem);
	}
</style>
