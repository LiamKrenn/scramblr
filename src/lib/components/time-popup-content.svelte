<script lang="ts">
	import type { Time } from "$lib/types";
	import { timeToFormattedString } from "$lib/utils";
	import { Trash } from "lucide-svelte";
	import Button from "./ui/button/button.svelte";

  export let time: Time;

  export let deleteTime: (id: number) => void;

  export let open: boolean;
</script>

<div class="p-4">
  <h2 class=" text-2xl">Time #{time[4]}</h2>
  <p class="text-4xl mt-2">{timeToFormattedString(time[0][1], 3)}</p>
  <Button on:click={() => {deleteTime(time[4])}} variant="destructive" class="absolute top-4 right-4">Delete <Trash class="p-1 -mr-1"/> </Button>
  <div class="flex">
    <Button on:click={() => {open = !open}} variant="outline" class="py-1 h-10 px-0 grow-[0.2] mr-2 mt-4">Cancel</Button>
    <Button on:click={() => {open = !open}} variant="secondary" class="py-1 h-10 px-0 grow  mt-4">Save</Button>
  </div>
</div>

