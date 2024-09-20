import { createRxServer } from 'rxdb-server/plugins/server';
import { RxServerAdapterExpress } from 'rxdb-server/plugins/adapter-express';
import { createRxDatabase } from 'rxdb';
import { getRxStorageMongoDB } from 'rxdb/plugins/storage-mongodb';

const rdb = await createRxDatabase({
	name: 'mongodb',
	storage: getRxStorageMongoDB({
		connection: process.env.MONGO_URL || ""
	}),
	ignoreDuplicate: true
});

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

await rdb.addCollections({
	sessions: {
		schema: sessionSchema
	},
	times: {
		schema: timeSchema
	}
});

const server = await createRxServer({
	database: rdb,
	adapter: RxServerAdapterExpress,
	port: 2443
});

// add endpoints here (see below)
const t_endpoint = server.addReplicationEndpoint({
	name: 'times',
	collection: rdb.collections.times
});

const s_endpoint = server.addReplicationEndpoint({
	name: 'sessions',
	collection: rdb.collections.sessions
});

console.log('Added replication endpoints');

// after adding the endpoints, start the server
await server.start();
