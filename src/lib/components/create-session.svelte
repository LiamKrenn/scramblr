<!-- @migration-task Error while migrating Svelte code: Cannot read properties of undefined (reading 'end') -->
<!-- @migration-task Error while migrating Svelte code: Cannot read properties of undefined (reading 'end') -->
<script lang="ts">
  import { mediaQuery } from "@sveltelegos-blue/svelte-legos";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { writable } from "svelte/store";
  import CreateSessionContent from "./create-session-content.svelte";
  import { disable_key_tracking } from "$lib/utils";
  import { type } from "$lib/scramble";
  import { user } from "$lib/stores";

  let open = writable(false);
  const isDesktop = mediaQuery("(min-width: 768px)");

  export function openCreateDialog() {
    disable_key_tracking.set(true);
    open.set(true);
  }

  open.subscribe((value) => {
    if (!value) {
      disable_key_tracking.set(false);
    }
  });

  // let session: Session = {
  //   name: "",
  //   scramble_type: "333",
  //   user_id: $user?.id || -1,
  //   order: 0,
  //   created_at: new Date(),
  // };
</script>

{#if $isDesktop}
  <Dialog.Root bind:open={$open}>
    <Dialog.Trigger></Dialog.Trigger>
    <Dialog.Content class="p-0 sm:max-w-[425px]">
      <CreateSessionContent {open} />
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open={$open}>
    <Drawer.Trigger class=""></Drawer.Trigger>
    <Drawer.Content class="">
      <CreateSessionContent {open} />
    </Drawer.Content>
  </Drawer.Root>
{/if}
