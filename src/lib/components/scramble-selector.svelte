<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import Button from "$lib/components/ui/button/button.svelte";
  import { new_scramble, type, typemap } from "$lib/scramble";

  let old_type = $type

  $: if (old_type != $type) {
    old_type = $type
    new_scramble($type)
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder class="absolute top-4 right-4 z-10">
    <Button variant="outline" builders={[builder]} class="absolute top-4 right-4 select-none">{typemap[$type]}</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="">
    <DropdownMenu.RadioGroup bind:value={$type}>
      {#each Object.keys(typemap) as key}
      <DropdownMenu.RadioItem value={key}>{typemap[key]}</DropdownMenu.RadioItem>
      {/each}
    </DropdownMenu.RadioGroup>
  </DropdownMenu.Content>
</DropdownMenu.Root>
