<script lang="ts">
	import Form from '$lib/components/forms/Form.svelte';
	import FormField, { type FormFieldDropdownOption } from '$lib/components/forms/FormField.svelte';
	import ContentBox from '$lib/components/layout/ContentBox.svelte';
	import SimpleHeader from '$lib/components/layout/SimpleHeader.svelte';
	import type { ActionData } from '../$types';
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData; form: ActionData } = $props();

	let parserDropDownOptions: FormFieldDropdownOption[] = $derived(
		data.parsers.map((parser) => ({
			value: parser.id,
			label: parser.title
		}))
	);

	let targetDropDownOptions: FormFieldDropdownOption[] = $derived(
		data.targets.map((target) => ({
			value: target.id,
			label: target.title
		}))
	);

	let copied = $state(false);
	let timeout: ReturnType<typeof setTimeout>;

	function copyToClipboard() {
		const url = `${window.location.origin}${resolve(`/api/hook/${data.hook.id}`)}`;
		navigator.clipboard.writeText(url);
		copied = true;
		clearTimeout(timeout);
		timeout = setTimeout(() => (copied = false), 2000);
	}
</script>

<SimpleHeader title="Hook Editor" />
<ContentBox showBack={true}>
	<h1>Editing "{data.hook.title}"</h1>

	<div class="webhook-url-container">
		<p>Use this URL to trigger this hook:</p>
		<button class="copy-button" class:success={copied} type="button" onclick={copyToClipboard}>
			{#if copied}
				<i class="fa-solid fa-check"></i>
				Copied
			{:else}
				<i class="fa-solid fa-copy"></i>
				Copy Webhook URL
			{/if}
		</button>
	</div>

	<Form endpoint="?/update" submitButtonText="Update Hook" submittingText="Updating...">
		<FormField
			label="Hook Title"
			field={{ type: 'text', name: 'title' }}
			value={data.hook.title}
			required={true}
		/>
		<FormField
			label="Description"
			field={{ type: 'textarea', name: 'description' }}
			value={data.hook.description}
		/>
		<FormField
			label="Parser"
			field={{ type: 'dropdown', name: 'parserId', dropdownOptions: parserDropDownOptions }}
			value={data.hook.parserId}
			required={true}
		/>
		<FormField
			label="Target"
			field={{ type: 'dropdown', name: 'targetId', dropdownOptions: targetDropDownOptions }}
			value={data.hook.targetId}
			required={true}
		/>
	</Form>
</ContentBox>

<style>
	.webhook-url-container {
		margin-bottom: 2rem;
		padding: 1rem;
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 0.5rem;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		gap: 1rem;
		display: flex;
	}

	.copy-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		/* from SubmitButton.svelte */
		background-color: var(--russian-violet, #38023b);
		color: var(--baby-powder, #fdfffc);
		border: 2px solid var(--russian-violet, #38023b);
		border-radius: 0.5rem;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.copy-button:hover {
		border-color: var(--bright-pink-crayola, #ff6978);
	}

	.copy-button.success {
		background-color: var(--yellow-green);
		border-color: var(--yellow-green);
		color: var(--smoky-black);
		transition: all 0.3s ease-in-out;
	}
</style>
