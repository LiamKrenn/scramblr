<script lang="ts">
	import ScramblePreview from '$lib/components/scramble-preview.svelte';
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
	import Timer from '$lib/components/timer.svelte';
	import { new_scramble, scramble } from '$lib/scramble';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	import Separator from '$lib/components/ui/separator/separator.svelte';

	export let data: PageData;

	let time = 0;

	onMount(async () => {
		await new_scramble();
	});
</script>

<button class="relative flex h-full w-full select-none flex-col items-center justify-center">
	<!-- Absolutes -->
	<ScrambleSelector />
	<div
		id="scrambleContainer"
		class="absolute top-20 !-z-10 block h-[32%] max-h-[32%] justify-center text-balance text-center text-3xl !leading-[125%] md:top-4 md:mx-36"
	>
		<div class="flex h-full items-center">
			<p class="w-full cursor-default select-none px-4" id="scramble">
				{$scramble}
			</p>
		</div>
	</div>
	<!-- Flex's -->
	<div class="!-z-20 h-full w-full grow" />
	<Timer bind:time />

	<div class="w-full px-4">
		<Separator class="my-1 h-1 rounded" />
	</div>

	<!-- UI -->
	<div class="z-20 flex h-full w-full grow flex-row p-2">
		<!-- Left -->
		<div class="grow">times</div>

		<Separator class="mx-1 w-1 rounded" orientation="vertical" />

		<!-- Middle -->

		<div class="hidden grow flex-col items-center md:flex">
			<!-- Stats -->
			<div class=" w-full grow">stats</div>

			<!-- Logo -->
			<h1 class="flex w-max grow-0 cursor-pointer select-none items-end justify-center text-3xl">
				<p class=" font-semibold opacity-90">scramblr</p>

				<a
					class="!z-20 ml-2 text-sm opacity-75"
					href="https://github.com/LiamKrenn"
					target="_blank"
				>
					by
					<span class="underline"> Liam Krenn </span>
				</a>
			</h1>
		</div>

		<Separator class="mx-1 hidden w-1 rounded md:flex" orientation="vertical" />

		<!-- Right -->
		<div class="flex grow-[0.3] flex-col md:grow">
			<!-- Preview -->
			<ScramblePreview class="h-[30%] w-full grow-0 p-2 md:h-full" />

			<div class="flex w-full px-2 md:hidden">
				<Separator class=" h-1 rounded " />
			</div>

			<!-- Stats -->
			<div class="flex w-full grow md:hidden">stats</div>

			<!-- Logo -->
			<h1
				class="flex cursor-pointer select-none flex-col text-3xl md:hidden md:text-4xl lg:text-5xl"
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
		</div>
	</div>
</button>
