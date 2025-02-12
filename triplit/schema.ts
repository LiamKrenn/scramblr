import { Schema as S, type ClientSchema, type Entity } from "@triplit/client";

export const schema = {
  sessions: {
    schema: S.Schema({
      id: S.Id(),
      user_id: S.Number(),
      name: S.String({ default: S.Default.now() }),
      order: S.Number({ default: 0 }),
      scramble_type: S.String({ default: "333" }),
      times: S.RelationMany("times", {
        where: [["session_id", "=", "$id"]],
      }),
      created_at: S.Date({ default: S.Default.now() }),
    }),
  },
  times: {
    schema: S.Schema({
      id: S.Id(),
      session_id: S.Number(),
      time: S.Number(),
      penalty: S.Number({ default: 0 }),
      scramble: S.String({ nullable: true, default: "" }),
      comment: S.String({ nullable: true, default: "" }),
      timestamp: S.Date({ default: S.Default.now() }),
    }),
  },
} satisfies ClientSchema;

export type Session = Entity<typeof schema, "sessions">;
export type Time = Entity<typeof schema, "times">;
