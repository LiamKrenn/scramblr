<script lang="ts">
	import * as DropdownMenu from './ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Box, Menu, Timer, Settings, LogIn } from 'lucide-svelte';
	import MenuItem from './menu-item.svelte';
	import { cn } from '$lib/utils';
	import type { WCAUser } from '$lib/types';

	let className: string = '';
	export { className as class };

	export let user: WCAUser | null = null;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder class="absolute right-4  top-4 z-20">
		<Button
			variant="outline"
			builders={[builder]}
			class={cn(className, 'absolute right-4  top-4 z-20 h-14 w-14 p-3 lg:h-16 lg:w-16')}
			><Menu class="h-full w-full" /></Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="z-20 ">
		<MenuItem path="/">
			<Timer class="mr-2" />
			<p>Timer</p>
		</MenuItem>
		<MenuItem path="/scrambler">
			<Box class="mr-2 " />
			<p>Scrambler</p>
		</MenuItem>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="cursor-pointer text-lg lg:py-2 lg:text-xl">
			<Settings class="mr-2" />
			<p>Settings</p>
		</DropdownMenu.Item>
		{#if user == null}
			<MenuItem path="/login">
				<LogIn class="mr-2" />
				<p>Login</p>
			</MenuItem>
		{:else}
    <MenuItem path="/user">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img class="h-6 w-6 mr-2 rounded-full bg-slate-800" src="{user.avatar.url}" />
      <p>{user.name}</p>
    </MenuItem>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
