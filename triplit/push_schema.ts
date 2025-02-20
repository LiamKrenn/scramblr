import * as dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config();

exec(
  "bunx triplit schema push --remote " +
    process.env.LIVE_TRIPLIT_DB_URL +
    " --token " +
    process.env.LIVE_TRIPLIT_SERVICE_TOKEN,
  (error, stdout, stderr) => {
    console.log(`Output: ${error}  ${stdout}  ${stderr}`);
  }
);
