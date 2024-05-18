<script lang="ts">
	import * as DropdownMenu from './ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Box, Menu, Timer, Settings } from 'lucide-svelte';
	import MenuItem from './menu-item.svelte';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder  class="absolute right-4 top-4">
		<Button
			variant="outline"
			builders={[builder]}
			class="absolute right-4 top-4 z-10 h-14 w-14 lg:h-16 lg:w-16"
			><Menu class="h-full w-full" /></Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="z-10 ">
		<MenuItem path="/">
			<Box class="mr-2" />
			<p>Scrambler</p>
		</MenuItem>
		<MenuItem path="/timer">
			<Timer class="mr-2" />
			<p>Timer</p>
		</MenuItem>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="cursor-pointer lg:py-2 lg:text-xl">
			<Settings class="mr-2" />
			<p>Settings</p>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
