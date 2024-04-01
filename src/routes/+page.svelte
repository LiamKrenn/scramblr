<script lang="ts">
	import { onMount } from 'svelte';
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
	import { new_scramble, scramble, type } from '$lib/scramble';
	import { getSelectedText } from '$lib/utils';
	import { TwistyPlayer, type TwistyPlayerConfig } from 'cubing/twisty';

	let twisty_player: TwistyPlayer | null = null;

	onMount(async () => {
		twisty_player = document.querySelector('twisty-player');
		if (twisty_player) {
			twisty_player.background = 'none';
			twisty_player.controlPanel = 'none';
			twisty_player.visualization = '2D';
		}
		await click();
		setTimeout(function () {
			if (twisty_player) {
				twisty_player.classList.remove('hidden');
			}
		}, 10);
	});

	async function click() {
		await new_scramble($type);
	}

	async function textClick() {
		if (getSelectedText() == '') {
			click();
		}
	}

	$: if (twisty_player && $scramble) {
		twisty_player.alg = $scramble;
	}
</script>

<div class="relative flex h-full w-full items-center justify-center">
	<ScrambleSelector />

	<button
		on:click={click}
		class="absolute flex h-full w-full cursor-pointer flex-col items-center justify-center"
	/>
	<button
		on:click={textClick}
		class="absolute mx-[8%] cursor-text select-text text-balance text-center text-3xl !leading-[125%] lg:text-5xl"
		><p class="w-full px-4">
			{$scramble}
		</p></button
	>

	<twisty-player class="absolute bottom-4 right-4 hidden" />
</div>
