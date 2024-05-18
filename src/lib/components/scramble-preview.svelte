<script lang="ts">
	import { scramble, type, typemap } from '$lib/scramble';
	import { TwistyPlayer } from 'cubing/twisty';
	import { onMount } from 'svelte';

	let twisty_player: TwistyPlayer | null = null;

	onMount(async () => {
		twisty_player = document.querySelector('twisty-player');
		if (twisty_player) {
			twisty_player.background = 'none';
			twisty_player.controlPanel = 'none';
			twisty_player.visualization = '2D';
		}
		setTimeout(function () {
			if (twisty_player) {
				twisty_player.classList.remove('hidden');
			}
		}, 10);
	});

	$: if (twisty_player && $scramble) {
		twisty_player.alg = typemap[$type].pre_moves + ' ' + $scramble;
	}
	$: if (twisty_player && $type) {
		twisty_player.puzzle = typemap[$type].puzzle;
	}
</script>

<twisty-player class="absolute bottom-4 right-0 hidden max-w-full px-2" />
