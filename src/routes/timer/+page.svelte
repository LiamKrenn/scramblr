<script lang="ts">
	import ScramblePreview from '$lib/components/scramble-preview.svelte';
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
	import Timer from '$lib/components/timer.svelte';
	import { new_scramble, scramble } from '$lib/scramble';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	import Separator from '$lib/components/ui/separator/separator.svelte';

	export let data: PageData;


  let parent;


	let time = 0;


  let pElement: HTMLParagraphElement;

	onMount(async () => {
		await new_scramble();
  
	});



</script>

<button class="relative flex h-full w-full select-none flex-col items-center justify-center">
	<!-- Absolutes -->
	<ScrambleSelector />

  <div class="scrambleContainer absolute w-full h-[20%] md:top-4 top-20 md:px-28 px-4 bg-red-500 block ">
    {#if $scramble.length > 200}
    
    <p class="scramble text-[3cqmin] text-balance" >
      {$scramble}
    </p>
    {:else if  $scramble.length > 100}
    <p class="scramble text-[4cqmin] text-balance" >
      {$scramble}
    </p>
    {:else if $scramble.length > 50}
    <p class="scramble text-[5cqmin] text-balance" >
      {$scramble}
    </p>
    {:else}
    <p class="scramble text-[6cqmin] text-balance" >
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
	<div class="!-z-20 h-full w-full grow" />
	<Timer bind:time />

	<div class="w-full px-4">
		<Separator class="my-1 h-0.5 rounded xl:h-1" />
	</div>

	<!-- UI -->
	<div class="z-20 flex h-full w-full grow flex-row p-2">
		<!-- Left -->
		<div class="grow">times</div>

		<Separator class="mx-1 rounded" orientation="vertical" />

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

		<Separator class="mx-1 hidden rounded md:flex" orientation="vertical" />

		<!-- Right -->
		<div class="flex grow-[0.7] flex-col md:grow">
			<!-- Preview -->
			<ScramblePreview class="h-[30%] w-full grow-0 p-0 md:h-full" />

			<!-- Stats -->
			<div class="flex w-full grow md:hidden">stats</div>
		</div>
	</div>
</button>


