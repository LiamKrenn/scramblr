<script lang="ts">
  import {
    Progress as ProgressPrimitive,
    type WithoutChildrenOrChild,
  } from "bits-ui";
  import { cn } from "$lib/utils.js";

  let {
    done = false,
    ref = $bindable(null),
    class: className,
    max = 100,
    value,
    ...restProps
  }: WithoutChildrenOrChild<ProgressPrimitive.RootProps> & {
    done?: boolean;
  } = $props();
</script>

<ProgressPrimitive.Root
  bind:ref
  class={cn(
    "bg-secondary relative h-4 w-full overflow-hidden rounded-full",
    className,
  )}
  {value}
  {max}
  {...restProps}
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
</ProgressPrimitive.Root>
