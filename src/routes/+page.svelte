<script lang="ts">
	import { onMount } from 'svelte';
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
	import { new_scramble, scramble, type } from '$lib/scramble';
	import { getSelectedText } from '$lib/utils';
	import ScramblePreview from '$lib/components/scramble-preview.svelte';

	onMount(async () => {
		await click();
	});

	async function click() {
		await new_scramble($type);
	}

	async function textClick() {
		if (getSelectedText() == '') {
			click();
		}
	}
</script>

<div class="relative flex h-full w-full items-center justify-center">
	<ScrambleSelector />
	<ScramblePreview />
	<button
		on:click={click}
		class="absolute flex h-full w-full cursor-pointer flex-col items-center justify-center"
	/>
	<button
		on:click={textClick}
		class="absolute mx-[8%] cursor-text select-text text-balance text-center text-3xl !leading-[125%] lg:text-5xl"
	>
		<p class="w-full px-4">
			{$scramble}
		</p>
	</button>
</div>
