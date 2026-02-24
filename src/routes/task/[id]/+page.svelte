<script lang="ts">
	import ContentBox from '$lib/components/layout/ContentBox.svelte';
	import SimpleHeader from '$lib/components/layout/SimpleHeader.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { task } = $derived(data);

	function getStatusColor(status: string) {
		switch (status) {
			case 'success':
				return '#4caf50';
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

	function formatDate(dateStr: string | null) {
		if (!dateStr) return 'Pending...';
		return new Date(dateStr).toLocaleString();
	}

	function getDuration(start: string | null, end: string | null) {
		if (!start || !end) return null;
		const duration = new Date(end).getTime() - new Date(start).getTime();
		return `${(duration / 1000).toFixed(2)}s`;
	}

	function formatJson(str: string | null) {
		if (!str) return '';
		try {
			const obj = JSON.parse(str);
			return JSON.stringify(obj, null, 2);
		} catch (e) {
			return str;
		}
	}
</script>

<SimpleHeader title="Task Viewer" />

<ContentBox maxWidth="1200px" showBack={true} backRef="/">
	<div class="header">
		<h1>Task Details for {data.name}</h1>
		<span class="status-badge" style="background-color: {getStatusColor(task.status)}">
			{task.status.replace(/_/g, ' ')}
		</span>
	</div>

	<div class="meta-grid">
		<div class="meta-item">
			<span class="label">Hook ID</span>
			<span class="value">{task.hookId}</span>
		</div>
		<div class="meta-item">
			<span class="label">Start Time</span>
			<span class="value">{formatDate(task.startTime)}</span>
		</div>
		<div class="meta-item">
			<span class="label">End Time</span>
			<span class="value">{formatDate(task.endTime)}</span>
		</div>
		<div class="meta-item">
			<span class="label">Duration</span>
			<span class="value">{getDuration(task.startTime, task.endTime) ?? '-'}</span>
		</div>
	</div>

	<div class="section">
		<h2>Webhook Payload</h2>
		<pre><code>{formatJson(task.webhook_payload)}</code></pre>
	</div>

	<div class="section">
		<h2>Parsed Result</h2>
		{#if task.parsed_result}
			<pre><code>{formatJson(task.parsed_result)}</code></pre>
		{:else}
			<p class="empty">No result available</p>
		{/if}
	</div>
</ContentBox>

<style>
	.header {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
	}

	.status-badge {
		padding: 4px 12px;
		border-radius: 16px;
		font-size: 0.9rem;
		font-weight: 600;
		text-transform: uppercase;
		color: white;
	}

	.meta-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 24px;
		margin-bottom: 32px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 24px;
		border-radius: 8px;
	}

	.meta-item {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.label {
		font-size: 0.8rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.6);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.value {
		font-family: monospace;
		font-size: 1.1rem;
		color: rgba(255, 255, 255, 0.9);
		word-break: break-all;
	}

	.section {
		margin-bottom: 32px;
	}

	h2 {
		font-size: 1.2rem;
		margin-bottom: 12px;
		color: rgba(255, 255, 255, 0.9);
	}

	pre {
		background: rgba(0, 0, 0, 0.3);
		padding: 16px;
		border-radius: 8px;
		overflow-x: auto;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	code {
		font-family: 'Fira Code', monospace;
		font-size: 0.9rem;
		color: #e0e0e0;
	}

	.empty {
		color: rgba(255, 255, 255, 0.3);
		font-style: italic;
	}
</style>
