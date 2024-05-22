<script lang="ts">
	import ScramblePreview from '$lib/components/scramble-preview.svelte';
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
	import Timer from '$lib/components/timer.svelte';
	import { new_scramble, scramble, times } from '$lib/scramble';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Menu from '$lib/components/menu.svelte';
	import type { Session, Time } from '$lib/types';
	import { get } from 'svelte/store';
	import { timeToFormattedString } from '$lib/utils';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import TimeItem from '$lib/components/time-item.svelte';
	import TimePopup from '$lib/components/time-popup.svelte';

	export let data: PageData;

	let time = 0;
	let in_solve = false;

	$: index = $times.length > 0 ? $times[0][4] + 1 : 0;

	$: if (time) {
		times.update((times) => {
			return [[[0, time], $scramble, '', Date.now(), index], ...times];
		});
		console.log(get(times));
		time = 0;
	}

	let time_popup: TimePopup;
	onMount(async () => {
		await new_scramble();
	});
</script>

<TimePopup bind:this={time_popup} />

<button
	class="relative flex h-full w-full cursor-default select-none flex-col items-center justify-center"
>
	{#if !in_solve}
		<!-- Absolutes -->

		<Menu />
		<ScrambleSelector />

		<div
			class="scrambleContainer absolute top-20 block h-[20%] w-full text-balance px-4 md:top-4 md:px-28"
		>
			{#if $scramble.length > 200}
				<p class="scramble text-balance text-[3.3cqmin]">
					{$scramble}
				</p>
			{:else if $scramble.length > 100}
				<p class="scramble text-balance text-[5cqmin]">
					{$scramble}
				</p>
			{:else if $scramble.length > 50}
				<p class="scramble text-balance text-[6cqmin]">
					{$scramble}
				</p>
			{:else}
				<p class="scramble text-balance text-[7cqmin]">
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
		<div class="absolute bottom-0 h-[25%] w-full sm:h-[33%]">
			<div class="w-full px-4">
				<Separator class="my-1 h-0.5 rounded xl:h-1" />
			</div>
			<!-- UI -->
			<div class="absolute z-20 flex h-full w-full grow flex-row p-2">
				<!-- Left -->
				<ScrollArea class="grow overflow-y-auto !w-full  ">
            {#each $times as time}
						{#if time_popup != undefined}
							<TimeItem {time} openTimePopup={time_popup.openTimePopup} />
						{/if}
					{/each}
					
				</ScrollArea>

				<Separator class="mx-1 rounded grow-0" orientation="vertical" />

				<!-- Middle -->

				<div class="hidden grow flex-col w-full items-center md:flex">
					<!-- Stats -->
					<div class="w-full grow">stats</div>

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
				<Separator class="mx-1 hidden rounded md:flex grow-0" orientation="vertical" />

				<!-- Right -->
				<div class="flex grow w-full flex-col">
					<!-- Preview -->
					<ScramblePreview class="h-[30%] min-h-[30%] w-full grow-0 p-0 md:h-full" />

					<!-- Stats -->
					<div class="flex w-full grow md:hidden">stats</div>
				</div>
			</div>
		</div>
	{/if}
</button>

<style>
	.scramble {
		font-size: clamp(1.2rem, 3.3cqmin, 3.5rem);
	}

	.lslogos {
		font-size: clamp(1rem, 3cqmin, 3.5rem);
	}
	.lslogob {
		font-size: clamp(0.7rem, 1.5cqmin, 2rem);
	}
</style>
