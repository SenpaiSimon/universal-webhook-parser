<script lang="ts">
	import BasicAddComponent from '$lib/components/BasicAddComponent.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let targets = $derived(
		data.targets.map((target) => ({
			id: target.id,
			title: target.title + ' - Type \"' + target.targetImpl + '"'
		}))
	);
</script>

<div>
	<BasicAddComponent title="Targets" name="Target" listItems={targets} />
</div>

<style>
</style>
