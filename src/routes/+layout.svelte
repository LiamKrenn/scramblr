<script lang="ts">
  import "../app.pcss";

  import { new_scramble, type } from "$lib/scramble";
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";
  import { sessions, times, token, user } from "$lib/stores";
  import type { PageData } from "./$types";

  interface Props {
    children?: import("svelte").Snippet;
    data: PageData;
  }

  let { children, data }: Props = $props();

  async function detectSWUpdate() {
    const registration = await navigator.serviceWorker.ready;

    registration.addEventListener("updatefound", () => {
      const newSW = registration.installing;
      newSW?.addEventListener("statechange", () => {
        if (newSW.state === "installed") {
          if (confirm("New version available. Reload to update!")) {
            newSW.postMessage({ type: "SKIP_WAITING" });
            window.location.reload();
          }
        }
      });
    });
  }

  onMount(async () => {
    await detectSWUpdate();
    if (get(type) == "333") type.set("333");
  });
</script>

<title>scramblr</title>
<div class="h-full overflow-hidden flex">
  {@render children?.()}
</div>

<style>
  :global(:fullscreen, ::backdrop) {
    background-color: #020817;
  }
  :global(body) {
    overscroll-behavior-y: contain;
  }
</style>
