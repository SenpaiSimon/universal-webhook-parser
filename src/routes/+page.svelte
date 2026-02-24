<script lang="ts">
	import ContentBox from '$lib/components/layout/ContentBox.svelte';
	import SimpleHeader from '$lib/components/layout/SimpleHeader.svelte';
	import TaskItem from '$lib/components/TaskItem.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function getHookName(hookId: string) {
		let hookName = hookId;
		// look into hook array
		data.hooks.find((hook) => {
			if (hook.id === hookId) {
				hookName = hook.title;
				return true;
			}
			return false;
		});
		return hookName;
	}
</script>

<SimpleHeader title="Dashboard" />
<ContentBox maxWidth="1200px">
	<h1>Recent {data.maxTask} Tasks</h1>
	<div class="task-list">
		{#each data.tasks as task}
			<TaskItem {task} hookName={getHookName(task.hookId)} />
		{/each}
	</div>
</ContentBox>
