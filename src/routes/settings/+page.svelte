<script lang="ts">
	import Menu from '$lib/components/menu.svelte';
	import type { PageData } from './$types';
	import UploadCstimer from '$lib/components/upload-cstimer.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	async function downloadData() {
		let times = await triplit.fetch(triplit.query('times').build());
		let sessions = await triplit.fetch(triplit.query('sessions').build());

		// // Download JSON files
		downloadJSON(times, 'times.json');
		downloadJSON(sessions, 'sessions.json');

		function downloadJSON(data: any, filename: any) {
			const json = JSON.stringify(data);
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			link.click();
			URL.revokeObjectURL(url);
		}
	}
</script>

<div class="relative flex h-full w-full flex-col items-center p-8">
	<Menu user={data.user} />
	<h1 class="text-5xl font-semibold">Settings</h1>
	<h2 class="mb-4 mt-8 text-3xl">Import Data</h2>
	<UploadCstimer />
	<p class="mt-2 opacity-70">Attention! This will reset all of your current data.</p>
	<h2 class="mb-4 mt-8 text-3xl">Export Data</h2>
	<button class="bg-slate-900 text-white p-2 rounded-md" onclick={downloadData}>Download</button>
</div>
