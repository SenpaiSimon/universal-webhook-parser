import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const parser = sqliteTable('parser', {
	id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	descrition: text('description'),
	code: text('code').notNull()
});

export const hooks = sqliteTable('hooks', {
	id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	descrition: text('description'),
	parserId: text('parser_id')
			.references(() => parser.id)
			.notNull(),
	outHookUrl: text('out_hook_url').notNull(),
	outHookMethod: text('out_hook_method').notNull()
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
	status: text('status').notNull()
});