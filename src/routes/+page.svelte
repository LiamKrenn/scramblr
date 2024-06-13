<script lang="ts">
	import ScramblePreview from '$lib/components/scramble-preview.svelte';
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
	import Timer from '$lib/components/timer.svelte';
	import { new_scramble, scramble } from '$lib/scramble';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Menu from '$lib/components/menu.svelte';
	import { get } from 'svelte/store';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import TimeItem from '$lib/components/time-item.svelte';
	import TimePopup from '$lib/components/time-popup.svelte';
	import SessionSelector from '$lib/components/session-selector.svelte';
	import { session_id, fetching, sync, times } from '$lib/sync';
	import { RefreshCw } from 'lucide-svelte';
	import type { Time } from '$lib/types';

	export let data: PageData;

	let time = 0;
	$: time_count = $times.length;
	let in_solve = false;

	$: if (time) {
		solve_done();
	}

	async function solve_done() {
		let time_json: Time = {
			id: '',
			time: time,
			scramble: $scramble,
			session_id: get(session_id),
			penalty: 0,
			timestamp: Date.now()
		};

		fetching.set(true);
		sync.createTime(time_json);
		time = 0;

		if (logged_in) {
		}

		await syncTimes();
		fetching.set(false);
	}

	let time_popup: TimePopup;

	async function openTimePopup(id: string, index: number) {
		time_popup.openTimePopup(id, index);
	}

	async function syncTimes(fetching_set: boolean = false) {
    if (fetching_set) {
      fetching.set(true);
    }

		times.set(await sync.getTimesOfSession($session_id, 0));
    //time_count = $times.length;
    if (fetching_set) {
      fetching.set(false);
    }
	}

	onMount(async () => {
		await new_scramble();
		if (logged_in) {
			// if (get(session_id) == '') {
			//   let sessions = await get_sessions();
			//   session_id.set(sessions[0]._id);
			// }
			// const res = await fetch('/api/times');
			// const json = await res.json();
			// times.set(json);
		}
	});

	$: logged_in = data.user !== null;
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

	<div
		class="absolute bottom-0 h-[25%] w-full text-center sm:h-[33%] {in_solve
			? '-z-20 opacity-0'
			: ''}"
	>
		<div class="w-full px-4">
			<Separator class="my-1 h-0.5 rounded xl:h-1" />
		</div>
		<!-- UI -->
		<div class="absolute z-20 flex h-full w-full grow flex-row p-2">
			<!-- Left -->
			<div class="relative flex w-full flex-col pl-2">
				{#if $fetching}
					<div class="absolute right-2 top-0 flex items-center">
						<RefreshCw class="animate-spin" />
					</div>
				{/if}
				<div class="mb-2 flex h-8 w-full shrink-0 items-center justify-center">
					<h1 class="text-xl font-semibold">Times</h1>
				</div>
				<ScrollArea class="flex !w-full grow items-center overflow-y-auto">
          <!-- TODO: https://svelte-tiny-virtual-list.jonasgeiler.com/ -->
					<div class="mb-2">
						{#await syncTimes()}
							loading...
						{:then value}
							{#if $times.length > 0}
								{#each $times as time, i (time.id)}
									{#if time_popup != undefined}
										<TimeItem {time} {openTimePopup} index={time_count - i} />
									{/if}
								{/each}
							{/if}
						{/await}
					</div>
				</ScrollArea>
			</div>

			<Separator class="mx-1 grow-0 rounded" orientation="vertical" />

			<!-- Middle -->

			<div class="hidden w-full grow flex-col md:flex">
				<!-- Stats -->
				<div class="w-full grow px-2">
					{#if !logged_in}
						<div class="mb-2 rounded-lg bg-slate-800 p-2">
							<p>
								<a class="underline" href="/login">Log in</a> to save your times in the cloud!
							</p>
						</div>
					{/if}
					<div class=" flex items-center">
						<p class="mr-2">Session</p>
						<SessionSelector />
					</div>
					<p class="mt-2 text-balance rounded-lg bg-slate-800 p-1">
						Note: This app currently only stores data locally! Cloud storage is in development.
					</p>
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
				<ScramblePreview class="h-[30%] min-h-[30%] w-full grow-0 p-0 md:mb-2 md:h-full" />

				<!-- Stats -->
				<div class="flex w-full grow flex-col items-start p-2 md:hidden">
					{#if !logged_in}
						<div class="mx-2 rounded-lg bg-slate-800 p-2">
							<p>
								<a class="underline" href="/login">Log in</a> to save your times in the cloud!
							</p>
						</div>
					{/if}
					<div class=" flex items-center">
						<p class="mr-2">Session</p>
						<SessionSelector />
					</div>
					<p class="mt-2 text-balance rounded-lg bg-slate-800 p-1">
						Note: This app currently needs internet access! Offline mode is in development.
					</p>
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
</style>
