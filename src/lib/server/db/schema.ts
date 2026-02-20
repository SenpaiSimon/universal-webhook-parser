import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// step one after incoming webhook
export const parser = sqliteTable('parser', {
	id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	description: text('description'),
	code: text('code').notNull()
});

// where the output of the parser goes to
export const target = sqliteTable('target', {
	id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
	targetImpl: text('target_impl').notNull(),
	title: text('title').notNull(),
	description: text('description'),
	settings: text('settings').notNull()
});

// routine to tie all together
export const hooks = sqliteTable('hooks', {
	id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	description: text('description'),
	parserId: text('parser_id')
			.references(() => parser.id, { onDelete: 'cascade' })
			.notNull(),
	targetId: text('target_id')
			.references(() => target.id, { onDelete: 'cascade' })
			.notNull()
});


export const task = sqliteTable('task', {
	id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
	hookId: text('hook_id')
			.references(() => hooks.id)
			.notNull(),
	startTime: text('start_time').$default(() => new Date().toISOString()),
	endTime: text('end_time'),
	status: text('status').notNull(),
	webhook_payload: text('webhook_payload').notNull(),
	parsed_result: text('parsed_result')
});

export const settingsEmail = sqliteTable('settings_email', {
	id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
	smtpServer: text('smtp_server').notNull(),
	smtpPort: text('smtp_port').notNull(),
	username: text('username').notNull(),
	password: text('password').notNull(),
	fromAddress: text('from_address').notNull()
});