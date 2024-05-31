<script lang="ts">
	import type { TimeJson } from '$lib/types';
	import { timeToFormattedString } from '$lib/utils';

	import Button from '$lib/components/ui/button/button.svelte';
	export let time: TimeJson;

	export let openTimePopup: (id: string) => void;
</script>

<p class="flex justify-center w-full ">
	<Button
		class="ml-1 h-min p-0 px-1 text-lg font-normal duration-150"
		variant="ghost"
		on:click={() => {
			openTimePopup(time._id);
		}}
	>
		{timeToFormattedString(time.time.time, 3)}
	</Button>
</p>
