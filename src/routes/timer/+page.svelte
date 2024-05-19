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

<div class="relative flex h-full w-full items-center justify-center select-none">
	<ScrambleSelector />
	<ScramblePreview />
	<div
		id="scrambleContainer"
		class="absolute top-20 block h-[37%] max-h-[37%] w-[90%] select-text text-balance text-center text-3xl !leading-[125%] opacity-80"
	>
		<p class="w-full cursor-text px-4" id="scramble">
			{$scramble}
		</p>
	</div>
	<Timer bind:time />
</div>
