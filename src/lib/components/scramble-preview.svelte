<script lang="ts">
	import { run } from 'svelte/legacy';

	import { scramble, type, typemap } from '$lib/scramble';
	import { cn } from '$lib/utils';
	import { TwistyPlayer } from 'cubing/twisty';
	import { onMount } from 'svelte';

	let twisty_player: TwistyPlayer | null = $state(null);

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

	run(() => {
		if (twisty_player && $scramble) {
			twisty_player.alg = typemap[$type].pre_moves + ' ' + $scramble;
		}
	});
	run(() => {
		if (twisty_player && $type) {
			twisty_player.puzzle = typemap[$type].puzzle;
		}
	});

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
	
</script>

<twisty-player class={cn(className, 'hidden')}></twisty-player>
