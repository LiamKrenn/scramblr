<script lang="ts">
  import Menu from "$lib/components/menu.svelte";
  import type { PageData } from "./$types";
  import UploadCstimer from "$lib/components/upload-cstimer.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<div class="relative flex h-full w-full flex-col items-center p-8">
  <Menu user={data.user} />
  <h1 class="text-5xl font-semibold">Settings</h1>
  <h2 class="mb-4 mt-8 text-3xl">Import Data</h2>
  <UploadCstimer />
  <p class="mt-2 opacity-70">
    Attention! This will reset all of your current data.
  </p>
</div>
