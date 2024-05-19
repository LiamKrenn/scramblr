<script lang="ts">
	import ScramblePreview from '$lib/components/scramble-preview.svelte';
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
	import Timer from '$lib/components/timer.svelte';
	import { new_scramble, scramble } from '$lib/scramble';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;

	let time = 0;

	onMount(async () => {
		await new_scramble();
	});

  
</script>



<button class="relative flex flex-col h-full w-full select-none items-center justify-center">
  <!-- Absolutes -->
	<ScrambleSelector />
	<div
		id="scrambleContainer"
		class="absolute md:top-4 top-20 block h-[32%] max-h-[32%] md:mx-36 select-text text-balance text-center text-3xl !leading-[125%]"
	>
		<p class="-z-10 w-full cursor-default select-none px-4" id="scramble">
			{$scramble}
		</p>
	</div>
  <!-- Flex's -->
  <div class="grow w-full h-full"/>
	<Timer bind:time />
  <div class="grow w-full h-full bg-yellow-500 flex flex-row p-2">
    <!-- Left -->
    <div class="grow bg-red-500">
      other
    </div>
    <!-- Right -->
    <div class="grow-[0.3] bg-violet-500">
      <!-- Logo -->
      <h1 class="flex cursor-pointer select-none flex-col text-3xl lg:text-4xl xl:text-5xl bg-black">
        <p class=" font-semibold opacity-90">scramblr</p>
      
        <a
          class="!z-20 text-sm opacity-75 lg:mt-1 md:text-base"
          href="https://github.com/LiamKrenn"
          target="_blank"
        >
          by
          <span class="underline"> Liam Krenn </span>
        </a>
      </h1>
      <!-- Preview -->
      <ScramblePreview class="bg-green-500 grow-0 w-full h-[30%]"/>
    </div>
  </div>

  
</button>
