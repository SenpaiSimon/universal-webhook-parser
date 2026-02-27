<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ParsedResult } from '$lib/runner/parser/types';
	import type { IncHookStatus } from '../../routes/api/hook/[id]/+server';

	type Task = {
		id: string;
		hookId: string;
		startTime: string | null;
		endTime: string | null;
		status: string;
		webhook_payload: string;
		parsed_result: null | string;
	};

	let { task, hookName }: { task: Task; hookName: string } = $props();

	let resTitleField = $derived(
		task.parsed_result ? JSON.parse(task.parsed_result).title : 'No Result'
	);

	function getStatusColor(status: IncHookStatus) {
		switch (status) {
			case 'success':
				return '#4caf50';
			case 'skipped':
				return '#9e9e9e';
			case 'pending':
				return '#ff9800';
			case 'invalid':
			case 'execution_error':
			case 'result_error':
			case 'webhook_error':
			case 'config_error':
				return '#f44336';
			default:
				return '#9e9e9e';
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'success':
				return 'fa-check';
			case 'pending':
				return 'fa-clock';
			case 'invalid':
				return 'fa-ban';
			case 'skipped':
				return 'fa-angles-right';
			case 'execution_error':
			case 'result_error':
			case 'webhook_error':
			case 'config_error':
				return 'fa-exclamation-triangle';
			default:
				return 'fa-question';
		}
	}

	function formatDate(dateStr: string | null) {
		if (!dateStr) return 'Pending...';
		return new Date(dateStr).toLocaleString();
	}

	function getDuration(start: string | null, end: string | null) {
		if (!start || !end) return null;
		const duration = new Date(end).getTime() - new Date(start).getTime();
		return `${(duration / 1000).toFixed(2)}s`;
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="task-item" onclick={() => goto(`/task/${task.id}`)}>
	<div class="status-icon" style="color: {getStatusColor(task.status as IncHookStatus)}">
		<i class="fa-solid {getStatusIcon(task.status)}"></i>
	</div>
	<div class="content">
		<div class="header">
			<span class="hook-id">{hookName} - {resTitleField}</span>
			<span class="time">{formatDate(task.startTime)}</span>
		</div>
		<div class="meta">
			<code class="id">{task.id}</code>
			<span class="status" style="color: {getStatusColor(task.status as IncHookStatus)}">
				{task.status.replace(/_/g, ' ')}
			</span>
			{#if task.startTime && task.endTime}
				<span class="duration">
					<i class="fa-solid fa-stopwatch"></i>
					{getDuration(task.startTime, task.endTime)}
				</span>
			{/if}
		</div>
	</div>
	<div class="arrow">
		<i class="fa-solid fa-chevron-right"></i>
	</div>
</div>

<style>
	.task-item {
		display: flex;
		align-items: center;
		gap: 16px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 16px;
		border-radius: 8px;
		margin-bottom: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.task-item:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.2);
		transform: translateY(-1px);
	}

	.status-icon {
		font-size: 1.25rem;
		width: 32px;
		display: flex;
		justify-content: center;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.hook-id {
		font-weight: 600;
		font-size: 1.1rem;
		color: var(--baby-powder, #fff);
	}

	.time {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.5);
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 0.9rem;
	}

	.id {
		font-family: monospace;
		background: rgba(0, 0, 0, 0.2);
		padding: 2px 6px;
		border-radius: 4px;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.8em;
	}

	.status {
		text-transform: capitalize;
		font-weight: 500;
	}

	.duration {
		color: rgba(255, 255, 255, 0.5);
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.arrow {
		color: rgba(255, 255, 255, 0.2);
		transition: color 0.2s;
	}

	.task-item:hover .arrow {
		color: rgba(255, 255, 255, 0.8);
	}
</style>
