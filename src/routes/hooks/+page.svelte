<script lang="ts">
	import BasicAddComponent from '$lib/components/BasicAddComponent.svelte';
	import ContentBox from '$lib/components/layout/ContentBox.svelte';
	import SimpleHeader from '$lib/components/layout/SimpleHeader.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function getParserNameById(id: string) {
		let parser = data.parsers.find((parser) => parser.id === id);
		return parser ? parser.title : '';
	}

	function getTargetNameById(id: string) {
		let target = data.targets.find((target) => target.id === id);
		return target ? target.title : '';
	}

	let hooks = $derived(
		data.hooks.map((hook) => ({
			id: hook.id,
			title:
				hook.title +
				' - Taget: ' +
				getTargetNameById(hook.targetId) +
				' - Parser: ' +
				getParserNameById(hook.parserId)
		}))
	);
</script>

<BasicAddComponent listItems={hooks} name="Hook" title="Hooks" />
