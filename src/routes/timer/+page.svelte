<script lang="ts">
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>


<div class="relative flex h-full w-full items-center justify-center">
	<ScrambleSelector />
	
  <p class="text-4xl">Work in Progress!</p>
</div>

