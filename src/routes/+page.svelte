<script lang="ts">
	import { onMount } from 'svelte';
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
	import { new_scramble, scramble } from '$lib/scramble';
	import { getSelectedText } from '$lib/utils';
	import ScramblePreview from '$lib/components/scramble-preview.svelte';
	import Menu from '$lib/components/menu.svelte';

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

<h1
	class="absolute left-4 top-4 flex cursor-pointer select-none flex-col text-3xl md:bottom-4 md:top-auto lg:text-4xl xl:text-5xl"
>
	<p class="-z-10 font-semibold opacity-90">scramblr</p>

	<a
		class="!z-20 text-sm opacity-75 md:text-base lg:mt-1"
		href="https://github.com/LiamKrenn"
		target="_blank"
	>
		by
		<span class="underline"> Liam Krenn </span>
	</a>
</h1>

<Menu class="!z-30" />
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
		class="absolute mx-[8%] h-[40%] max-h-[40%] select-text text-balance block text-center"
	>
		{#if $scramble.length > 200}
			<p class="scramble text-balance text-[3.3cqmin] ">
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
	</button>
</div>

<style>
  .scramble {
    font-size: clamp(1.2rem, 3.3cqmin, 3.5rem);
  }
</style>
