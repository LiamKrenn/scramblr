<script lang="ts">
	import { new_scramble, type } from '$lib/scramble';
	import { onMount } from 'svelte';
	import '../app.pcss';
	import { get } from 'svelte/store';
	import Menu from '$lib/components/menu.svelte';
	import { resize_to_fit } from '$lib/utils';

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
		await detectSWUpdate();
		if (get(type) == '333') type.set('333');
		resize_to_fit(document);
	});
</script>

<svelte:window
	on:resize={() => {
		resize_to_fit(document);
	}}
/>

<title>scramblr</title>
<div class="h-full overflow-hidden">
	<slot />
</div>

<Menu />

<h1
	class="absolute left-0 top-0 ml-4 mt-2 flex cursor-pointer select-none flex-col text-3xl md:text-5xl"
>
	<button
		class="font-semibold opacity-90"
		on:click={() => {
			new_scramble();
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
