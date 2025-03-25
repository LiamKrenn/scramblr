import { TriplitClient } from "@triplit/client";
import { IndexedDbExperimentalKVStore } from "@triplit/entity-db";
import { schema } from "../../triplit/schema";
import {
  PUBLIC_TRIPLIT_SERVER_URL,
  PUBLIC_TRIPLIT_TOKEN,
} from "$env/static/public";
import { browser } from "$app/environment";

// The TriplitClient has 4 main options
// - storage: The storage engine you want to use. This can be
//   'memory' or 'indexeddb'.
// - schema: The schema you defined for your app, which
//   will be used to generate types for client methods
//   and handle local database operations
// - serverUrl: The URL of your Triplit server
// - token: The token you got from the Triplit dashboard
//
// Without the serverUrl or token, the client will operate in
// offline mode

// You can edit batch size to see what works best
const storage = new IndexedDbExperimentalKVStore("<your-db-name>", {
  batchSize: 2500,
});
export const triplit = new TriplitClient({
  storage: "memory",
  schema,
  serverUrl: PUBLIC_TRIPLIT_SERVER_URL,
  autoConnect: false,
});
