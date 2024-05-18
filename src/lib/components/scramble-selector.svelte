<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { new_scramble, type, typemap, types } from '$lib/scramble';

	$: if ($type) {
		new_scramble();
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder class="">
		<Button
			variant="outline"
			builders={[builder]}
			class="absolute lg:right-24 right-[5.5rem] top-4 z-10 select-none h-14  lg:h-16 lg:w-auto lg:text-xl"
			>{typemap[$type].display}</Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="z-10 lg:w-40">
		<DropdownMenu.RadioGroup bind:value={$type}>
			{#each Object.keys(types) as group}
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="cursor-pointer select-none lg:text-xl">
						{group}
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="w-auto ">
						{#each types[group] as cube}
							<DropdownMenu.RadioItem class="cursor-pointer pr-4 lg:py-2 lg:text-xl" value={cube}
								>{typemap[cube].display}</DropdownMenu.RadioItem
							>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
