<script lang="ts">
  import { mediaQuery } from "@sveltelegos-blue/svelte-legos";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import TimePopupContent from "./time-popup-content.svelte";
  import type { Time } from "../../../triplit/schema";

  let open = $state(false);
  const isDesktop = mediaQuery("(min-width: 768px)");

  let time = $state<Time | undefined>(undefined);
  let index: number = 0;

  export async function openTimePopup(wtime: Time, index: number) {
    console.log(time);

    time = wtime;
    index = index;
    open = true;
  }

  async function deleteTime(id: string) {
    // sync.deleteTime(id);
    open = false;
  }

  function close() {
    open = false;
  }
</script>

{#if $isDesktop}
  <Dialog.Root bind:open>
    <Dialog.Trigger></Dialog.Trigger>
    <Dialog.Content class="p-0 sm:max-w-[425px]">
      {#if time != undefined}
        <TimePopupContent {time} {deleteTime} {close} {index} />
      {/if}
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open>
    <Drawer.Trigger class="absolute"></Drawer.Trigger>
    <Drawer.Content class="">
      {#if time != undefined}
        <TimePopupContent {time} {deleteTime} {close} {index} />
      {/if}
    </Drawer.Content>
  </Drawer.Root>
{/if}
