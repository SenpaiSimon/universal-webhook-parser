<script lang="ts">
	import BasicAddComponent from '$lib/components/BasicAddComponent.svelte';
	import type { ActionData, PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let parsers = $derived(
		data.parsers.map((parser) => ({
			id: parser.id,
			title: parser.title
		}))
	);
</script>

<div>
	<BasicAddComponent title="Parsers" name="Parser" listItems={parsers} />
</div>

<style>
</style>
