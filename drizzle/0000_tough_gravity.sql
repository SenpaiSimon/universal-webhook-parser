CREATE TABLE `hooks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`parser_id` text NOT NULL,
	`out_hook_url` text NOT NULL,
	`out_hook_method` text NOT NULL,
	FOREIGN KEY (`parser_id`) REFERENCES `parser`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `parser` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`code` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` text PRIMARY KEY NOT NULL,
	`hook_id` text NOT NULL,
	`start_time` text,
	`end_time` text,
	`status` text NOT NULL,
	FOREIGN KEY (`hook_id`) REFERENCES `hooks`(`id`) ON UPDATE no action ON DELETE no action
);
