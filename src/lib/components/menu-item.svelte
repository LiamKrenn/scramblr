<script lang="ts">
	import * as DropdownMenu from './ui/dropdown-menu';
	import { page } from '$app/stores';

	interface Props {
		path: string;
		children?: import('svelte').Snippet;
	}

	let { path, children }: Props = $props();
</script>

<a href={path}>
	{#if $page.url.pathname == path}
		<DropdownMenu.Item class="cursor-pointer bg-slate-800 pr-4 text-lg lg:py-2 lg:text-xl">
			{@render children?.()}
		</DropdownMenu.Item>
	{:else}
		<DropdownMenu.Item class="cursor-pointer pr-4 text-lg lg:py-2 lg:text-xl">
			{@render children?.()}
		</DropdownMenu.Item>
	{/if}
</a>
