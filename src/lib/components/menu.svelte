<script lang="ts">
  import * as DropdownMenu from "./ui/dropdown-menu";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Box, Menu, Timer, Settings, LogIn } from "lucide-svelte";
  import MenuItem from "./menu-item.svelte";
  import { cn } from "$lib/utils";
  import type { WCAUser } from "$lib/types";

  interface Props {
    class?: string;
    user?: WCAUser | null;
  }

  let { class: className = "", user = null }: Props = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="absolute right-4 top-4 z-20">
    <Button
      variant="outline"
      class={cn(
        className,
        "z-20 h-14 w-14 p-3 focus:border-slate-50 lg:h-16 lg:w-16",
      )}><Menu class="!h-full !w-full" /></Button
    >
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="z-20">
    <MenuItem path="/">
      <Timer class="!h-full !w-auto" />
      <p>Timer</p>
    </MenuItem>
    <MenuItem path="/scrambler">
      <Box class="!h-full !w-auto" />
      <p>Scrambler</p>
    </MenuItem>
    <DropdownMenu.Separator />
    <MenuItem path="/settings">
      <Settings class="!h-full !w-auto" />
      <p>Settings</p>
    </MenuItem>
    <!-- <DropdownMenu.Item class="cursor-pointer text-lg lg:py-2 lg:text-xl">
			<Settings class="mr-2" />
			<p>Settings</p>
		</DropdownMenu.Item> -->
    {#if user == null}
      <MenuItem path="/login">
        <LogIn class="!h-full !w-auto" />
        <p>Login</p>
      </MenuItem>
    {:else}
      <MenuItem path="/user">
        <!-- svelte-ignore a11y_missing_attribute -->
        <img
          class="mr-2 h-6 w-6 rounded-full bg-slate-800"
          src={user.avatar.url}
        />
        <p>{user.name}</p>
      </MenuItem>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
