<script lang="ts">
	import { enhance } from '$app/forms';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import Form from '$lib/components/forms/Form.svelte';
	import FormField from '$lib/components/forms/FormField.svelte';
	import ContentBox from '$lib/components/layout/ContentBox.svelte';
	import SimpleHeader from '$lib/components/layout/SimpleHeader.svelte';
	import { base64Decode, base64Encode } from '$lib/helpers/encoders';
	import { genParserInterfaceString, genParserVarInit } from '$lib/runner/parser/types';
	import type { ActionData } from '../$types';
	import type { PageData } from './$types';

	const codeContext = `
${genParserInterfaceString()}

${genParserVarInit({ timestamp: '', data: {} })}
`;

	let { data }: { data: PageData; form: ActionData } = $props();

	let unpackedCode = $derived(data.parser.code ? base64Decode(data.parser.code) : '');
	let hasErrors = $state(false);
	let errorMessage = $state('');
</script>

<SimpleHeader title="Parser Editor" />
<ContentBox showBack={true}>
	<h1>Editing "{data.parser.title}"</h1>

	<Form
		endpoint="?/update"
		submitButtonText="Update Parser"
		submittingText="Updating..."
		blockSubmit={hasErrors}
		blockMessage="Please fix errors in your code before submitting."
	>
		<FormField
			label="Title"
			field={{ type: 'text', name: 'title' }}
			value={data.parser.title}
			required={true}
		/>
		<FormField
			label="Description"
			field={{ type: 'textarea', name: 'description' }}
			value={data.parser.description}
			required={false}
		/>
		<p>Code</p>
		{#if errorMessage}
			<p style="color: red">{errorMessage}</p>
		{/if}
		<CodeEditor
			bind:value={unpackedCode}
			bind:hasErrors
			contextSnippet={codeContext}
			language="typescript"
		></CodeEditor>
		<input type="hidden" name="encodedCode" value={base64Encode(unpackedCode)} />
	</Form>
</ContentBox>
