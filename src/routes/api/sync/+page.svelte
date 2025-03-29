<script lang="ts">
  import { onMount } from "svelte";

  import { createTime, pg } from "./pglite";

  let data: any = [];
  let sessions: any = [];

  pg.live.query("SELECT * FROM times ORDER BY id", [], (res) => {
    data = res.rows;
  });

  pg.live.query("SELECT * FROM sessions ORDER BY id", [], (res) => {
    sessions = res.rows;
  });
</script>

<div
  class="bg-slate-800 text-slate-200 h-full w-full flex items-center justify-center"
>
  <button onclick={() => createTime()}> create </button>
  {#each data as foo}
    <div class="bg-slate-700 text-slate-200 p-4 m-4 rounded-lg">
      {foo.time}
    </div>
  {/each}

  {#each sessions as foo}
    <div class="bg-slate-700 text-slate-200 p-4 m-4 rounded-lg">
      {foo.name}
    </div>
  {/each}
</div>
