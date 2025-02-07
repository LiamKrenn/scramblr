<script lang="ts">
  import "../app.pcss";

  import { new_scramble, type } from "$lib/scramble";
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

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
    //resize_to_fit(document);
  });
</script>

<svelte:window
  onresize={() => {
    //resize_to_fit(document);
  }}
/>

<title>scramblr</title>
<div class="h-full overflow-hidden">
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
