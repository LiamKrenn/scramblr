<script lang="ts">
  import { CircleCheckBig, RefreshCw, UploadIcon } from "lucide-svelte";
  import { FileDrop } from "svelte-droplet";
  import Progress from "./ui/progress/progress.svelte";
  import { getUUID } from "$lib/utils";
  import { type Session, type Time } from "../../../triplit/schema";
  import { triplit } from "$lib/client";
  import { user } from "$lib/stores";

  let done = $state(false);

  let idb_size_map: { [key: number]: number } = {};
  let global_time_count = 0;
  async function handleFiles(files: File[]) {
    // TODO: efficiency - load & convert first and then insert

    for (const file of files) {
      //for (let i = 0; i < 20; i++) {

      uploaded_file = file;
      let cstimer_json = await JSON.parse(await uploaded_file.text());
      let cstimer_keys = Object.keys(cstimer_json);
      let cstimer_sessionData = await JSON.parse(
        cstimer_json.properties.sessionData,
      );

      let session_keys = [];
      for (let key of cstimer_keys) {
        if (key.startsWith("session")) {
          session_keys.push(key);
          let session = cstimer_json[key];
          time_count += session.length;
        }
      }
      time_count += session_keys.length;
      time_count -= 100;

      // resed idb
      // sync.deleteAllSessions();
      // sync.deleteAllTimes();

      let session_id_map: { [cs_id: string]: string } = {};

      // create sessions
      for (let key of session_keys) {
        let cs_session_id = key.split("session")[1];
        let cs_session_props = cstimer_sessionData[cs_session_id];
        let cs_opt = cs_session_props.opt;

        let srcType = "333";
        if (Object.keys(cs_opt).includes("scrType")) {
          let cs_srcType: string = cs_opt.scrType;

          if (cs_srcType.includes("222")) {
            srcType = "222";
          } else if (cs_srcType.includes("333")) {
            srcType = "333";
          } else if (cs_srcType.includes("444")) {
            srcType = "444";
          } else if (cs_srcType.includes("555")) {
            srcType = "555";
          } else if (cs_srcType.includes("666")) {
            srcType = "666";
          } else if (cs_srcType.includes("777")) {
            srcType = "777";
          } else if (cs_srcType == "skbso") {
            srcType = "skewb";
          } else if (cs_srcType == "ll") {
            srcType = "oll";
          } else if (cs_srcType == "pyrso") {
            srcType = "pyraminx";
          } else if (cs_srcType == "mgmp") {
            srcType = "megaminx";
          }
        }

        let new_session: Session = {
          name: cs_session_props.name,
          order: cs_session_props.rank,
          scramble_type: srcType,
          user_id: $user?.id || -1,
          created_at: new Date(),
        };

        let res = await triplit.insert("sessions", new_session);
        session_id_map[cs_session_id] = res.output?.id || "0";
        times_processed++;
      }

      // create times
      for (let key of session_keys) {
        let session = cstimer_json[key];
        let session_id = key.split("session")[1];
        for (let time of session) {
          // TODO: Multi-Phase Timer
          let c_time = time[0][1];

          let new_time: Time = {
            time: c_time,
            session_id: session_id_map[session_id],
            scramble: time[1],
            comment: time[2],
            timestamp: new Date(time[3] * 1000),
            penalty: time[0][0],
            user_id: $user?.id || -1,
          };

          let res = await triplit.insert("times", new_time);

          console.log(res);

          times_processed++;
          // global_time_count++;

          // if (global_time_count % 1000 == 0) {
          // 	setTimeout(async () => {
          // 		const cache = 3000;
          // 		let total = (await navigator.storage.estimate()).usage || 0;
          // 		let idb_size = total - cache;
          // 		idb_size_map[global_time_count] = idb_size;
          //     console.log(global_time_count, idb_size);

          // 	}, 2000);
          // }
          //}
        }
      }

      done = true;

      // let times = await sync.getTimes();
      // let sessions = await sync.getSessions();

      // // Download JSON files
      // downloadJSON(times, 'times.json');
      // downloadJSON(sessions, 'sessions.json');

      // function downloadJSON(data: any, filename: any) {
      // 	const json = JSON.stringify(data);
      // 	const blob = new Blob([json], { type: 'application/json' });
      // 	const url = URL.createObjectURL(blob);
      // 	const link = document.createElement('a');
      // 	link.href = url;
      // 	link.download = filename;
      // 	link.click();
      // 	URL.revokeObjectURL(url);
      // }

      // downloadJSON(idb_size_map, 'idb_size_map.json');
    }
  }

  let uploaded_file: File | null = $state(null);

  let times_processed = $state(0);
  let time_count = $state(100);
</script>

{#if done}
  <div
    class="relative flex h-fit min-h-32 w-[90vw] max-w-96 flex-col items-center justify-center rounded-xl border-2 border-double border-green-500 bg-slate-900"
  >
    <div class="absolute right-0 top-0 m-3 flex items-center">
      <CircleCheckBig />
    </div>
    <p class="mx-2 text-balance break-all text-center">Upload done!</p>
    <Progress
      class="my-4 w-[80%]"
      value={times_processed}
      max={time_count}
      {done}
    />
    <p class="mx-2 text-balance text-center">
      You can go back to the <a href="/" class="underline">timer</a> now.
    </p>
  </div>
{:else if uploaded_file == null}
  <FileDrop {handleFiles} acceptedMimes={[".txt"]} max={1} let:droppable>
    <div
      class="flex h-fit min-h-32 w-[90vw] max-w-96 flex-col items-center justify-center rounded-xl border-2 border-dashed bg-slate-900 zone"
      class:droppable
    >
      <UploadIcon class="m-4 h-8 w-8" />
      <p class="mx-2 text-balance text-center">
        Select or drop the csTimer file
      </p>
    </div>
  </FileDrop>
{:else}
  <div
    class="relative flex h-fit min-h-32 w-[90vw] max-w-96 flex-col items-center justify-center rounded-xl border-2 border-double border-orange-400 bg-slate-900"
  >
    <div class="absolute right-0 top-0 m-3 flex items-center">
      <RefreshCw class="animate-spin" />
    </div>
    <p class="mx-2 text-balance break-all text-center opacity-70">
      {uploaded_file.name}
    </p>
    <Progress class="my-4 w-[80%]" value={times_processed} max={time_count} />
    <p class="mx-2 text-balance text-center">
      Working. Please don't refresh the page.
    </p>
  </div>
{/if}
