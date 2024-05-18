<script lang="ts">
	import * as DropdownMenu from './ui/dropdown-menu';
	import { page } from '$app/stores';

	export let path: string;
</script>

<a href={path}>
	{#if $page.url.pathname == path}
		<DropdownMenu.Item class="cursor-pointer bg-slate-800 pr-4 lg:py-2 lg:text-xl">
			<slot />
		</DropdownMenu.Item>
	{:else}
		<DropdownMenu.Item class="cursor-pointer pr-4 lg:py-2 lg:text-xl">
			<slot />
		</DropdownMenu.Item>
	{/if}
</a>
