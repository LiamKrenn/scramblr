<script lang="ts">
	import Menu from '$lib/components/menu.svelte';
	import { Input } from '$lib/components/ui/input';
	import { UploadIcon } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { FileDrop } from 'svelte-droplet';
	import UploadCstimer from '$lib/components/upload-cstimer.svelte';
	function handleFiles(files: File[]) {
		for (const file of files) {
			console.log(file.name);
		}
	}

	export let data: PageData;

</script>

<div class="relative flex h-full w-full flex-col items-center p-8">
	<Menu user={data.user} />
	<h1 class="text-5xl font-semibold">Settings</h1>
	<h2 class="mb-4 mt-8 text-3xl">Import Data</h2>
	<UploadCstimer />
	<p class="mt-2 opacity-70">Attention! This will reset all of your current data.</p>
</div>
