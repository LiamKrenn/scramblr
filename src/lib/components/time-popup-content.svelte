<script lang="ts">
	import type { Time } from '$lib/types';
	import { timeToFormattedString } from '$lib/utils';
	import { Trash } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';

	export let time: Time;
	export let index: number;
	export let deleteTime: (id: string) => void;
	export let close: () => void;
</script>

<div class="p-4">
	<h2 class="text-2xl">Time #{index}</h2>
	<p class="my-2 text-4xl">{timeToFormattedString(time.time, 3)}</p>
	<Button
		on:click={() => {
			deleteTime(time.id);
		}}
		variant="destructive"
		class="absolute right-4 top-4 mb-1"
		>Delete <Trash class="-mr-1 p-1" />
	</Button>
	<p class="mb-1">Scramble: <span class="rounded bg-slate-800 px-1">{time.scramble}</span></p>
	<p class="mb-1">Comment:</p>
	<p class="mb-1">Solved on: {new Date(time.timestamp).toLocaleString()}</p>
	<div class="flex">
		<Button on:click={close} variant="outline" class="mr-2 mt-4 h-10 grow-[0.2] px-0 py-1"
			>Cancel</Button
		>
		<Button on:click={close} variant="secondary" class="mt-4 h-10 grow px-0  py-1">Save</Button>
	</div>
</div>
