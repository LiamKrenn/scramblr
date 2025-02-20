import {
  Schema as S,
  type ClientSchema,
  type Entity,
  type Roles,
} from "@triplit/client";

const roles: Roles = {
  user: {
    match: {
      sub: "$userId",
    },
  },
};

const schema = {
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
    permissions: {
      user: {
        read: {
          filter: [["user_id", "=", "$role.userId"]],
        },
        insert: {
          filter: [["user_id", "=", "$role.userId"]],
        },
        update: {
          filter: [["user_id", "=", "$role.userId"]],
        },
        postUpdate: {
          filter: [["user_id", "=", "$role.userId"]],
        },
      },
    },
  },
  times: {
    schema: S.Schema({
      id: S.Id(),
      session_id: S.String(),
      time: S.Number(),
      user_id: S.Number(),
      penalty: S.Number({ default: 0 }),
      scramble: S.String({ nullable: true, default: "" }),
      comment: S.String({ nullable: true, default: "" }),
      timestamp: S.Date({ default: S.Default.now() }),
    }),
    permissions: {
      user: {
        read: {
          filter: [["user_id", "=", "$role.userId"]],
        },
        insert: {
          filter: [["user_id", "=", "$role.userId"]],
        },
        update: {
          filter: [["user_id", "=", "$role.userId"]],
        },
        postUpdate: {
          filter: [["user_id", "=", "$role.userId"]],
        },
      },
    },
  },
} satisfies ClientSchema;

export { schema, roles };

export type Session = Entity<typeof schema, "sessions">;
export type Time = Entity<typeof schema, "times">;
