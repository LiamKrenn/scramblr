<script lang="ts">
	import { onMount } from 'svelte';
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
	import { new_scramble, scramble } from '$lib/scramble';
	import { getSelectedText } from '$lib/utils';
	import ScramblePreview from '$lib/components/scramble-preview.svelte';

	onMount(async () => {
		await click();
	});

	async function click() {
		await new_scramble();
	}

	async function textClick() {
		if (getSelectedText() == '') {
			click();
		}
	}

	async function onKeyDown(e: KeyboardEvent) {
		if (e.keyCode == 32) {
			await click();
		}
	}
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<h1 class="absolute left-4 md:bottom-4 md:top-auto top-4 flex cursor-pointer select-none flex-col text-3xl lg:text-4xl xl:text-5xl">
  <p class="-z-10 font-semibold opacity-90">scramblr</p>

  <a
    class="!z-20 text-sm opacity-75 lg:mt-1 md:text-base"
    href="https://github.com/LiamKrenn"
    target="_blank"
  >
    by
    <span class="underline"> Liam Krenn </span>
  </a>
</h1>

<div class="relative z-10 flex h-full w-full items-center justify-center">
	<ScrambleSelector />
	<ScramblePreview class="absolute bottom-4 right-0 max-h-[20%] max-w-full px-2" />
	<button
		on:click={click}
		class="absolute flex h-full w-full cursor-pointer flex-col items-center justify-center"
	/>
	<button
		id="scrambleContainer"
		on:click={textClick}
		class="absolute mx-[8%] h-[40%] max-h-[40%] select-text text-balance text-center text-5xl !leading-[125%]"
	>
		<p class="w-full cursor-text px-4" id="scramble">
			{$scramble}
		</p>
	</button>
</div>
