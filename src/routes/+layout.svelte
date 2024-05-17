<script>
	import { new_scramble, type } from '$lib/scramble';
	import { onMount } from 'svelte';
	import '../app.pcss';
  import { pwaInfo } from 'virtual:pwa-info'; 

  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '' 

</script>

<svelte:head> 
 	{@html webManifestLink} 
</svelte:head>

<title>scramblr</title>

<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#020817" />
<slot />
<h1
	class="absolute left-0 top-0 ml-4 mt-2 flex cursor-pointer select-none flex-col text-3xl md:text-5xl"
>
	<button
		class="font-semibold"
		on:click={() => {
			new_scramble($type);
		}}>scramblrr</button
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
  :global(*) {
    --ion-safe-area-top: 0;
    --ion-safe-area-bottom: 0;
    --ion-safe-area-left: 0;
    --ion-safe-area-right: 0;
  }
</style>


