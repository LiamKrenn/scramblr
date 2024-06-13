<script lang="ts">
	import type { Time } from '$lib/types';
	import { timeToFormattedString } from '$lib/utils';

	import Button from '$lib/components/ui/button/button.svelte';
	export let time: Time;
	export let index: number;

	export let openTimePopup: (id: string, i: number) => Promise<void>;
</script>

<Button
	class="block h-min p-0 px-1 text-lg font-normal duration-150"
	variant="ghost"
	on:click={async () => {
		await openTimePopup(time.id, index);
	}}
>
	{index}. {timeToFormattedString(time.time, 3)}
</Button>
