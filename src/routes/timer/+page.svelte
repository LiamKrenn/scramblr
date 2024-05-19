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



<button class="relative flex flex-col h-full w-full select-none items-center justify-center">
  <!-- Absolutes -->
	<ScrambleSelector />
	<div
		id="scrambleContainer"
		class="absolute md:top-4 top-20 block h-[32%] max-h-[32%] md:mx-36 text-balance text-center text-3xl !leading-[125%]"
	>
		<p class="-z-10 w-full cursor-default  select-none px-4" id="scramble">
			{$scramble}
		</p>
	</div>
  <!-- Flex's -->
  <div class="grow w-full h-full !-z-20"/>
	<Timer bind:time />

  <div class="w-full px-4">
    <Separator class="my-1 h-1 rounded"/>
  </div>
  
  <!-- UI -->
  <div class="grow w-full h-full  flex-row p-2 flex">
    <!-- Left -->
    <div class="grow ">
      times
    </div>

    <Separator class="mx-1 w-1 rounded" orientation="vertical"/>

    <!-- Middle -->

    <div class="grow md:flex items-center flex-col hidden ">
      <!-- Stats -->
      <div class=" grow w-full">
        stats
      </div>

      <!-- Logo -->
      <h1 class="grow-0 w-max cursor-pointer flex justify-center items-end select-none text-3xl ">
        <p class=" font-semibold opacity-90">scramblr</p>
      
        <a
          class="!z-20 text-sm opacity-75 ml-2 "
          href="https://github.com/LiamKrenn"
          target="_blank"
        >
          by
          <span class="underline"> Liam Krenn </span>
        </a>
      </h1>
    </div>

    <Separator class="mx-1 w-1 rounded md:flex hidden" orientation="vertical"/>

    <!-- Right -->
    <div class="flex flex-col md:grow grow-[0.3] ">
      
      <!-- Preview -->
      <ScramblePreview class="p-2 grow-0 w-full md:h-full h-[30%]"/>
      
      <div class="md:hidden flex w-full px-2">
        <Separator class=" h-1 rounded " />
      </div>

      <!-- Stats -->
      <div class="md:hidden flex  grow w-full">
        stats
      </div>

      <!-- Logo -->
      <h1 class="md:hidden flex cursor-pointer select-none flex-col text-3xl md:text-4xl lg:text-5xl ">
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
    </div>
  </div>

 
</button>
