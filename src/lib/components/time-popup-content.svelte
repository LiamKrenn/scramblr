<script lang="ts">
  import { timeToFormattedString, timeToListString } from "$lib/utils";
  import { CopyIcon, Trash } from "lucide-svelte";
  import Button from "./ui/button/button.svelte";
  import type { Time } from "../../../triplit/schema";
  import { triplit } from "$lib/client";

  interface Props {
    time: Time;
    index: number;
    deleteTime: (id: string) => void;
    close: () => void;
  }

  let { time, index, deleteTime, close }: Props = $props();

  async function refresh() {
    let res = await triplit.fetchById("times", time.id);
    if (res) {
      time = res;
    } else {
      close();
    }
  }

  async function setPenalty(penalty: number) {
    await triplit.update("times", time.id, (time) => {
      time.penalty = penalty;
    });
    await refresh();
  }
</script>

<div class="p-4">
  <Button
    onclick={() => {
      deleteTime(time.id);
    }}
    variant="destructive"
    class="absolute right-4 top-4 mb-1 "
    >Delete <Trash class="-mr-1 " />
  </Button>

  <h2 class="text-2xl text-slate-200">Time #{index}</h2>
  <div class="flex w-full items-center justify-between my-2">
    <p class="my-2 text-4xl mr-2 relative">
      {timeToListString(time.time, time.penalty, 3)}
      {#if time.penalty < 0}
        <span class="text-lg text-slate-400 absolute bottom-0 ml-2">
          ({timeToFormattedString(time.time)})
        </span>
      {/if}
    </p>

    <div class="flex space-x-2">
      <Button
        variant="outline"
        onclick={() => {
          setPenalty(0);
        }}
        class={time.penalty == 0 ? "bg-slate-800" : ""}>OK</Button
      >
      <Button
        variant="outline"
        onclick={() => {
          setPenalty(2000);
        }}
        class={time.penalty > 0 ? "bg-slate-800" : ""}>+2</Button
      >
      <Button
        variant="outline"
        onclick={() => {
          setPenalty(-1);
        }}
        class={time.penalty < 0 ? "bg-slate-800" : ""}>DNF</Button
      >
    </div>
  </div>

  <p class="mb-1">
    Scramble: <span class="rounded bg-slate-800 px-1">{time.scramble}</span>
  </p>
  <p class="mb-1">Comment:</p>
  <p class="mb-1">Solved on: {new Date(time.timestamp).toLocaleString()}</p>
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
