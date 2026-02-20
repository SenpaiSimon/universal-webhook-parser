<script lang="ts">
	import { enhance } from '$app/forms';
	import BasicAddComponent from '$lib/components/BasicAddComponent.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let parsers = $derived(
		data.parsers.map((parser) => ({
			id: parser.id,
			title: parser.title
		}))
	);

	let errMsg = $derived(form?.error ? form.error : '');
</script>

<div>
	<BasicAddComponent title="Parsers" name="Parser" listItems={parsers} {errMsg} />
</div>

<style>
</style>
