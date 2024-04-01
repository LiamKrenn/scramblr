<script lang="ts">
	import { onMount } from "svelte";
	import ScrambleSelector from "$lib/components/scramble-selector.svelte";
	import { new_scramble, scramble, type } from "$lib/scramble";

	onMount(async () => {
    await click()
	});

  async function click() {
    await new_scramble($type)
  }
</script>


<div class="relative h-full w-full">
  <ScrambleSelector />
  <button on:click={click} class="h-full w-full flex flex-col justify-center items-center cursor-pointer">
    <p class="text-3xl lg:text-5xl select-none w-[83%] text-balance text-center !leading-[125%]">{$scramble}</p>
  </button>
</div>
