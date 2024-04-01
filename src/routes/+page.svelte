<script lang="ts">
	import { onMount } from "svelte";
  import { Scrambow } from "$lib/scrambow/scrambow";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import Button from "$lib/components/ui/button/button.svelte";

  let position = "bottom";
  
  let scramble = "loading..."
  let type = "333"
  let old_type = type

  let typemap = {
    "333": "3x3x3",
    "222": "2x2x2",
    "444": "4x4x4",
    "cross": "Cross",
    "oll": "OLL",
    "pll": "PLL",
  }

	onMount(async () => {
    await new_scramble()
	});

  $: if (old_type != type) {
    old_type = type
    new_scramble()
  }

  async function new_scramble() {
    if (type == "pll") {
      scramble = new Scrambow().setType(type).setLength(16).get()[0].scramble_string;
    } else {
      scramble = new Scrambow().setType(type).get()[0].scramble_string;
    }
    console.log(scramble);
  }
</script>


<div class="relative h-full w-full">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder class="absolute top-4 right-4 z-10">
      <Button variant="outline" builders={[builder]} class="absolute top-4 right-4 select-none">{typemap[type]}</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="">
      <DropdownMenu.RadioGroup bind:value={type}>
        {#each Object.keys(typemap) as key}
        <DropdownMenu.RadioItem value={key}>{typemap[key]}</DropdownMenu.RadioItem>
        {/each}
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click={new_scramble} class="h-full w-full flex flex-col justify-center items-center cursor-pointer">
    <p class="text-[6vw] lg:text-5xl select-none w-[83%] break-words text-center">{scramble}</p>
  </div>
</div>
