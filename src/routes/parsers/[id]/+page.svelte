<script lang="ts">
	import { enhance } from '$app/forms';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import { base64Decode, base64Encode } from '$lib/helpers/encoders';
	import { genInterfaceString, genVarsInit } from '$lib/runner/types';
	import type { ActionData } from '../$types';
	import type { PageData, SubmitFunction } from './$types';

	const codeContext = `
${genInterfaceString()}

${genVarsInit({ timestamp: '', data: {} })}
`;

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let unpackedCode = $derived(data.parser.code ? base64Decode(data.parser.code) : '');
	let hasErrors = $state(false);
	let errorMessage = $state('');

	const handleSubmit: SubmitFunction = ({ formData, cancel }) => {
		if (hasErrors) {
			errorMessage = 'Please fix errors in the code before submitting.';
			// add timeout to clear error message after 5 seconds
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
			cancel();
			return;
		}

		return async ({ result, update }) => {
			await update({ reset: false });
		};
	};
</script>

<div>
	<h1>Parser Editor - {data.parser.title}</h1>
	<form method="POST" action="?/update" use:enhance={handleSubmit}>
		<p>Title</p>
		<input type="text" name="title" placeholder="Enter parser title" value={data.parser.title} />

		<p>Description</p>
		<textarea name="description" placeholder="Enter parser description"
			>{data.parser.description}</textarea
		>

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

		<button type="submit">Update Parser</button>
	</form>
	{#if form?.error}
		<p style="color: red">{form.error}</p>
	{/if}
	{#if form?.success}
		<p style="color: green">Nice</p>
	{/if}
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
