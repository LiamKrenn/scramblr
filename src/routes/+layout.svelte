<script lang="ts">
	import { new_scramble, type } from '$lib/scramble';
	import { onMount } from 'svelte';
	import '../app.pcss';
  import { Button } from '$lib/components/ui/button';
  import { Maximize, Minimize } from 'lucide-svelte';

	async function detectSWUpdate() {
		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			newSW?.addEventListener('statechange', () => {
				if (newSW.state === 'installed') {
          if (confirm('New version available. Reload to update!')) {
            newSW.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
				}
			});
		});
	}

	onMount(async () => {
    fullscreen = document.fullscreenElement !== null;
		await detectSWUpdate();
	});

  let fullscreen = false;

  function toggleFullscreen() {
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
    fullscreen = !fullscreen;
  }
</script>

<title>scramblr</title>
<slot />

<Button on:click={toggleFullscreen} variant="ghost" class="absolute bottom-0 right-0 p-2 m-2">
  {#if fullscreen}
    <Minimize />
  {:else}
    <Maximize />
  {/if}

</Button>
<h1
	class="absolute left-0 top-0 ml-4 mt-2 flex cursor-pointer select-none flex-col text-3xl md:text-5xl"
>
	<button
		class="font-semibold"
		on:click={() => {
			new_scramble($type);
		}}>scramblr</button
	>

	<a
		class="text-sm opacity-75 md:mt-1 md:text-base"
		href="https://github.com/LiamKrenn"
		target="_blank"
	>
		by
		<span class="underline"> Liam Krenn </span>
	</a>
</h1>

<style>
  :global(:fullscreen, ::backdrop) {
    background-color: #020817;
  }
</style>

