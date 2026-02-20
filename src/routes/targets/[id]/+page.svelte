<script lang="ts">
	import Form from '$lib/components/forms/Form.svelte';
	import FormField, { type FormFieldDropdownOption } from '$lib/components/forms/FormField.svelte';
	import ContentBox from '$lib/components/layout/ContentBox.svelte';
	import SimpleHeader from '$lib/components/layout/SimpleHeader.svelte';
	import { type TargetType } from '$lib/targets/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	export type OptionEntry = {
		title: string;
		key: string;
		value: string;
		fieldType: 'text' | 'textarea' | 'dropdown';
		dropdownOptions?: FormFieldDropdownOption[];
	};

	function CreateDropDown(): FormFieldDropdownOption[] {
		const options: FormFieldDropdownOption[] = [];

		for (const target of data.availableTargets) {
			options.push({
				label: target,
				value: target
			});
		}

		return options;
	}

	function CreateTargetOptions(type: TargetType, settings: string): OptionEntry[] {
		let options: OptionEntry[] = [];
		const parsedSettings = JSON.parse(settings);

		switch (type) {
			case 'email': {
				options = [
					{
						title: 'Recipients',
						key: 'recipients',
						value: parsedSettings.recipients,
						fieldType: 'text'
					},
					{
						title: 'Subject Template',
						key: 'subjectTemplate',
						value: parsedSettings.subjectTemplate,
						fieldType: 'text'
					},
					{
						title: 'Body Template',
						key: 'bodyTemplate',
						value: parsedSettings.bodyTemplate,
						fieldType: 'textarea'
					}
				];
				break;
			}

			case 'webhook': {
				options = [
					{
						title: 'URL',
						key: 'url',
						value: parsedSettings.url,
						fieldType: 'text'
					},
					{
						title: 'Method',
						key: 'method',
						value: parsedSettings.method,
						fieldType: 'dropdown',
						dropdownOptions: [
							{ label: 'GET', value: 'GET' },
							{ label: 'POST', value: 'POST' }
						]
					}
				];
				break;
			}
		}

		return options;
	}

	let type = $derived(data.target.targetImpl) as TargetType;
	let dropDown = $derived(CreateDropDown());
	let settings = $derived(CreateTargetOptions(type, data.target.settings));
	let parsedSettings = $derived(JSON.stringify(settings));
</script>

<SimpleHeader title="Target Editor" />

<ContentBox showBack={true}>
	<h1>Editing "{data.target.title}"</h1>
	<Form endpoint="?/update" submitButtonText="Update Target" submittingText="Updating...">
		<input type="hidden" name="settings" value={parsedSettings} />
		<FormField
			label="Title"
			field={{ type: 'text', name: 'title' }}
			value={data.target.title}
			required={true}
		/>
		<FormField
			label="Description"
			field={{ type: 'textarea', name: 'description' }}
			value={data.target.description}
			required={false}
		/>
		<FormField
			label="Target Type"
			field={{ type: 'dropdown', name: 'type', dropdownOptions: dropDown }}
			bind:value={type}
			required={true}
		/>
		{#each settings as setting}
			<FormField
				label={setting.title}
				field={{
					type: setting.fieldType,
					name: setting.key,
					dropdownOptions: setting.dropdownOptions
				}}
				value={setting.value}
				required={true}
			/>
		{/each}
	</Form>
</ContentBox>
