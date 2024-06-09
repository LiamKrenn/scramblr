<script lang="ts">
	import { Progress as ProgressPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = ProgressPrimitive.Props;

	let className: $$Props['class'] = undefined;
	export let max: $$Props['max'] = 100;
	export let value: $$Props['value'] = undefined;
	export let done: $$Props['done'] = false;
	export { className as class };
</script>

<ProgressPrimitive.Root
	class={cn(
		'relative flex h-4 w-full items-center justify-center overflow-hidden rounded-full bg-secondary',
		className
	)}
	{...$$restProps}
>
	{#if done}
		<div
			class="h-full w-full flex-1 bg-green-500 transition-all"
			style={`transform: translateX(-${100 - (100 * (value ?? 0)) / (max ?? 1)}%)`}
		></div>
	{:else}
		<div
			class="h-full w-full flex-1 bg-primary transition-all"
			style={`transform: translateX(-${100 - (100 * (value ?? 0)) / (max ?? 1)}%)`}
		></div>
	{/if}

	<p class="absolute text-xs text-slate-500">{((100 * (value ?? 0)) / (max ?? 1)).toFixed(2)}%</p>
</ProgressPrimitive.Root>
