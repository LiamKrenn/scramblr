<script lang="ts">
	import type { TimeJson } from "$lib/types";
	import { timeToFormattedString } from "$lib/utils";
	import { Trash } from "lucide-svelte";
	import Button from "./ui/button/button.svelte";

  export let time: TimeJson;

  export let deleteTime: (id: string) => void;

  export let open: boolean;
</script>

<div class="p-4">
  <h2 class="text-2xl">Time #{time._id}</h2>
  <p class="text-4xl my-2">{timeToFormattedString(time.time.time, 3)}</p>
  <Button on:click={() => {deleteTime(time._id)}} variant="destructive" class="absolute top-4 right-4">Delete <Trash class="p-1 -mr-1"/> </Button>
  <p>Scramble: <span class="bg-slate-800 px-1 rounded">{time.scramble}</span></p>
  <div class="flex">
    <Button on:click={() => {open = !open}} variant="outline" class="py-1 h-10 px-0 grow-[0.2] mr-2 mt-4">Cancel</Button>
    <Button on:click={() => {open = !open}} variant="secondary" class="py-1 h-10 px-0 grow  mt-4">Save</Button>
  </div>
</div>

