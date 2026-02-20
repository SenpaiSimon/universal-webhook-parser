<script lang="ts">
	import ContentBox from '$lib/components/layout/ContentBox.svelte';
	import SimpleHeader from '$lib/components/layout/SimpleHeader.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SimpleHeader title="Dashboard" />
<ContentBox>
	<h1>Recent {data.tasks.length} Tasks</h1>
	<ul>
		{#each data.tasks as task}
			<li>
				<div>
					<p>Task {task.id} for target {task.hookId} is in state {task.startTime}</p>
				</div>
			</li>
		{/each}
	</ul>
</ContentBox>
