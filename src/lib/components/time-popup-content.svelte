<script lang="ts">
  import { timeToFormattedString } from "$lib/utils";
  import { CopyIcon, Trash } from "lucide-svelte";
  import Button from "./ui/button/button.svelte";
  import type { Time } from "$lib/types";

  interface Props {
    time: Time;
    index: number;
    deleteTimeClick: (id: string) => void;
    close: () => void;
  }

  let { time, index, deleteTimeClick, close }: Props = $props();
</script>

<div class="p-4">
  <h2 class="text-2xl">Time #{index}</h2>
  <p class="my-2 text-4xl">{timeToFormattedString(time.time, 3)}</p>
  <Button
    onclick={() => {
      deleteTimeClick(time.id);
    }}
    variant="destructive"
    class="absolute right-4 top-4 mb-1"
    >Delete <Trash class="-mr-1 p-1 !h-full !aspect-square !w-auto" />
  </Button>
  <p class="mb-1">
    Scramble: <span class="rounded bg-slate-800 px-1">{time.scramble}</span>
  </p>
  <p class="mb-1">Comment:</p>
  <p class="mb-1">
    Solved on: {new Date(time.timestamp || "").toLocaleString()}
  </p>
  <div class="flex">
    <Button
      onclick={close}
      variant="outline"
      class="mr-2 mt-4 h-10 grow-[0.2] px-0 py-1">Cancel</Button
    >
    <Button
      onclick={close}
      variant="secondary"
      class="mt-4 h-10 grow px-0  py-1">Save</Button
    >
  </div>
</div>
