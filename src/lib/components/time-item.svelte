<script lang="ts">
	import type { Time } from "$lib/types";
	import { timeToFormattedString } from "$lib/utils";

	import Button from '$lib/components/ui/button/button.svelte';
	import { Edit } from "lucide-svelte";
  export let time: Time;

  export let openTimePopup: (id: number) => void;
</script>

<p class="flex justify-center">{timeToFormattedString(time[0][1], 3)} <Button class="ml-1 p-0 h-min duration-150" variant="ghost" on:click={() => {openTimePopup(time[4])}}> <Edit class="scale-75"/> </Button> </p>

