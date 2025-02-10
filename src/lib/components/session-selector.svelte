<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import Button from "$lib/components/ui/button/button.svelte";
  import { onMount } from "svelte";
  import { Plus, Settings } from "lucide-svelte";
  import ScrollArea from "./ui/scroll-area/scroll-area.svelte";
  import CreateSession from "./create-session.svelte";
  import type { Session } from "$lib/types";

  let create_session: CreateSession | undefined = $state();
  let display_name: string = $state("Select Session");
  let open: boolean = $state(false);

  // rework
  let sessions: any[] = [];
  let session_id: string = $state("");

  async function setToSession(id: string) {
    // let res: Session | undefined = await sync.getSession(id);
    // if (res) {
    //   // session_id.set(id);
    //   // display_name = res.name;
    // } else {
    //   // let first_session = $sessions[0];
    //   // session_id.set(first_session.id);
    //   // display_name = first_session.name;
    // }
  }

  // session_id.subscribe(async (value) => {
  //   await setToSession(value);
  // });

  onMount(async () => {
    // setToSession($session_id);
  });
</script>

<CreateSession bind:this={create_session} />

<DropdownMenu.Root bind:open>
  <DropdownMenu.Trigger>
    <Button
      variant="outline"
      class="z-20 2xl:h-8 h-6 select-none sm:px-2 p-1 2xl:text-base text-sm focus:border-slate-50 flex-shrink sm:max-w-52 max-w-32"
    >
      <div class="overflow-ellipsis overflow-hidden max-w-full font-normal">
        {display_name}
      </div>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-52">
    <DropdownMenu.Label>Sessions</DropdownMenu.Label>
    <DropdownMenu.RadioGroup bind:value={session_id}>
      <ScrollArea class="max-h-[40svh] !overflow-y-auto cscroll">
        {#each sessions as session}
          <DropdownMenu.RadioItem
            onclick={() => {
              open = !open;
            }}
            value={session.id.toString()}
            class="cursor-pointer select-none mr-1 w-48"
          >
            <p class="overflow-hidden overflow-ellipsis">
              {session.name}
            </p>
          </DropdownMenu.RadioItem>
        {/each}
      </ScrollArea>
      <DropdownMenu.Separator />
      <DropdownMenu.Item
        class="cursor-pointer"
        onclick={create_session.openCreateDialog}
      >
        <Plus class="-ml-1 mr-1 h-4" /> Add Session
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        <Settings class="-ml-1 mr-1 h-4" /> Manage Session
      </DropdownMenu.Item>
    </DropdownMenu.RadioGroup>
  </DropdownMenu.Content>
</DropdownMenu.Root>
