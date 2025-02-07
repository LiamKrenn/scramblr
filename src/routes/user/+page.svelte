<script lang="ts">
    import Menu from '$lib/components/menu.svelte';
	import { LogIn, LogOut } from 'lucide-svelte';
import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
    
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>



<div class="relative w-full h-full flex flex-col items-center p-8">
  <Menu user={data.user} />
  {#if data.user != null}
  <h1 class="text-5xl font-semibold">{data.user.name}</h1>
  <!-- svelte-ignore a11y_missing_attribute -->
  <img class="mt-8 h-[20%]  aspect-square" src="{data.user.avatar.url}" />
  <h2 class="text-3xl font-semibold mt-8">Statistics</h2>
  <p class="mt-4">This feature is being worked on</p>
  <h2 class="text-3xl font-semibold mt-8">Logout</h2>
  <a class="mt-4" href="/logout">
    <Button variant="destructive">Log Out <LogOut class="ml-2" /></Button>
  </a>
  {:else}
     <p>You are not logged in</p>
     <a class="mt-4" href="/login">
      <Button variant="outline">Log In <LogIn class="ml-2" /></Button>
    </a>
  {/if}
</div>

