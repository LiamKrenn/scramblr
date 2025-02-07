<script lang="ts">
	import { run } from 'svelte/legacy';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { new_scramble, type, typemap, types } from '$lib/scramble';
	import ScrollArea from './ui/scroll-area/scroll-area.svelte';

	run(() => {
		if ($type) {
			new_scramble();
		}
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild  class="">
		{#snippet children({ builder })}
				<Button
				variant="outline"
				builders={[builder]}
				class="absolute right-[5.5rem] top-4 z-20 h-14 select-none text-lg focus:border-slate-50 md:left-4 md:right-auto lg:h-16 lg:w-auto lg:text-xl"
				>{typemap[$type].b_display}</Button
			>
					{/snippet}
		</DropdownMenu.Trigger>
	<DropdownMenu.Content class="lg:w-40">
		<DropdownMenu.RadioGroup bind:value={$type}>
			{#each Object.keys(types) as group}
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="cursor-pointer select-none lg:text-xl">
						{group}
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="w-auto ">
						<ScrollArea class="max-h-[90svh] !overflow-y-auto">
							{#each types[group] as cube}
								<DropdownMenu.RadioItem class="cursor-pointer pr-4 lg:py-2 lg:text-xl" value={cube}
									>{typemap[cube].display}</DropdownMenu.RadioItem
								>
							{/each}
						</ScrollArea>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
