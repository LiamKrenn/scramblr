export let ssr = false;
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
// import { replicateServer } from 'rxdb-server/plugins/replication-server';
import { browser } from '$app/environment';

addRxPlugin(RxDBMigrationSchemaPlugin);
addRxPlugin(RxDBDevModePlugin);

const sessionSchema = {
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			maxLength: 36
		},
		user_id: {
			type: 'integer'
		},
		name: {
			type: 'string'
		},
		order: {
			type: 'integer',
			minimum: 0,
			maximum: 65536,
			multipleOf: 1
		},
		scramble_type: {
			type: 'string'
		},
		updated: {
			type: 'integer',
			minimum: 0,
			maximum: 4503599627370495,
			multipleOf: 1
		}
	},
	required: ['user_id', 'name', 'order', 'scramble_type'],
	indexes: ['updated', 'order']
};

const timeSchema = {
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			maxLength: 36
		},
		session_id: {
			type: 'string',
			maxLength: 36
		},
		time: {
			type: 'integer'
		},
		penalty: {
			type: 'integer'
		},
		scramble: {
			type: 'string'
		},
		comment: {
			type: 'string'
		},
		timestamp: {
			type: 'integer',
			minimum: 0,
			maximum: 4503599627370495,
			multipleOf: 1
		},
		updated: {
			type: 'integer',
			minimum: 0,
			maximum: 4503599627370495,
			multipleOf: 1
		},
		archived: {
			type: 'boolean'
		}
	},
	required: ['session_id', 'time', 'scramble', 'timestamp'],
	indexes: ['updated', 'timestamp', 'session_id']
};

export const ldb = await createRxDatabase({
	name: 'ldb',
	storage: getRxStorageDexie()
});

await ldb.addCollections({
	sessions: {
		schema: sessionSchema
	},
	times: {
		schema: timeSchema
	}
});

if (browser) {
	// const replicationState = replicateServer({
	// 	replicationIdentifier: 'my-couchdb-replication',
	// 	collection: ldb.collections.times,
	// 	url: PUBLIC_SERVER_URL + '/times/0',
	// 	live: true,
	// 	pull: {
	// 		batchSize: 60
	// 	},
	// 	push: {
	// 		batchSize: 60
	// 	}
	// });
}
