<script lang="ts">
	import { new_scramble, type } from '$lib/scramble';
	import { onMount } from 'svelte';
	import '../app.pcss';
	import { get } from 'svelte/store';
	import Menu from '$lib/components/menu.svelte';
	import { resize_to_fit } from '$lib/utils';

  import { page } from '$app/stores';
  import { persisted } from 'svelte-persisted-store'

  page.subscribe(value => {console.log(value)});


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



<style>
	:global(:fullscreen, ::backdrop) {
		background-color: #020817;
	}
</style>
