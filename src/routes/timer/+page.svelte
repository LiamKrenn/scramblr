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

<button class="relative flex h-full w-full select-none items-center justify-center">
	<ScrambleSelector />
	<ScramblePreview />
	<div
		id="scrambleContainer"
		class="absolute md:top-4 top-20 block h-[32%] max-h-[32%] md:mx-36 select-text text-balance text-center text-3xl !leading-[125%]"
	>
		<p class="-z-10 w-full cursor-default select-none px-4" id="scramble">
			{$scramble}
		</p>
	</div>
	<Timer bind:time />
</button>
