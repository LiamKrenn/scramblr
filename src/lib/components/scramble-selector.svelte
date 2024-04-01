<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import Button from "$lib/components/ui/button/button.svelte";
  import { new_scramble, type, typemap, types } from "$lib/scramble";

  $: if ($type) {
    new_scramble($type)
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder class="absolute top-4 right-4">
    <Button variant="outline" builders={[builder]} class="z-10 absolute top-4 right-4 select-none lg:text-xl lg:h-16 lg:w-24">{typemap[$type].display}</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="z-10 lg:w-40">
    <DropdownMenu.RadioGroup bind:value={$type}>
      {#each types as type}
        {#if !type.startsWith("_")}
          <DropdownMenu.RadioItem class="cursor-pointer lg:text-xl lg:my-1" value={type}>{typemap[type].display}</DropdownMenu.RadioItem>
        {:else}
          <DropdownMenu.Label class="select-none lg:text-xl">{type.substring(1)}</DropdownMenu.Label>
        {/if}
      {/each}
    </DropdownMenu.RadioGroup>
  </DropdownMenu.Content>
</DropdownMenu.Root>
