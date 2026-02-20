<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';
	import SubmitButton from './SubmitButton.svelte';

	let {
		endpoint,
		submitButtonText = 'Submit',
		maxWidth = '100%',
		onSuccess = undefined,
		onFailure = undefined,
		submittingText = 'Submitting...',
		submitButtonId = 'submit-button',
		blockSubmit = false,
		blockMessage = 'Submissions are currently blocked.',
		resetFormOnSuccess = true,
		children
	}: {
		endpoint: string;
		onSuccess?: (result: ActionResult) => void;
		onFailure?: (result: ActionResult) => void;
		maxWidth?: string;
		submitButtonId?: string;
		submitButtonText?: string;
		submittingText?: string;
		blockSubmit?: boolean;
		blockMessage?: string;
		resetFormOnSuccess?: boolean;
		children: Snippet;
	} = $props();

	let formMessage: { type: 'success' | 'error'; text: string } | null = $state(null);
	let submitting = $state(false);
	let formElement: HTMLFormElement;

	const handleEnhance: SubmitFunction = ({ cancel }) => {
		if (blockSubmit) {
			formMessage = { type: 'error', text: blockMessage };

			setTimeout(() => {
				formMessage = null;
			}, 3000);

			cancel();
			return;
		}

		submitting = true;
		formMessage = null;

		return async ({
			result,
			update
		}: {
			result: ActionResult;
			update: (options?: { reset?: boolean }) => Promise<void>;
		}) => {
			submitting = false;

			if (result.type === 'success' && result.data?.message) {
				formMessage = { type: 'success', text: result.data.message };
				if (resetFormOnSuccess) {
					formElement.reset();
				}
			} else if (result.type === 'failure' && result.data?.message) {
				formMessage = { type: 'error', text: result.data.message };
			} else if (result.type === 'error') {
				formMessage = { type: 'error', text: 'An unexpected error occurred.' };
			}

			setTimeout(() => {
				formMessage = null;
			}, 3000);

			// This is the crucial part:
			// We tell SvelteKit to proceed with its default behavior.
			// We pass `reset: false` because we are already handling the form reset manually.
			update({ reset: false });

			if (result.type === 'success' && onSuccess) {
				onSuccess(result);
			} else if ((result.type === 'failure' || result.type === 'error') && onFailure) {
				onFailure(result);
			}
		};
	};
</script>

<form
	bind:this={formElement}
	method="POST"
	action={endpoint}
	style:max-width={maxWidth}
	use:enhance={handleEnhance}
	enctype="multipart/form-data"
>
	{@render children()}
	<hr />
	<div class="form-footer">
		<SubmitButton
			id={submitButtonId}
			{submitting}
			{formMessage}
			{submittingText}
			text={submitButtonText}
		/>
	</div>
</form>

<style>
	form {
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: rgba(253, 255, 252, 0.05); /* semi-transparent baby-powder */
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		padding: 2rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(253, 255, 252, 0.15);
		margin: 0 auto;
		box-sizing: border-box;
	}

	hr {
		width: 100%;
		border: none;
		border-top: 1px solid rgba(253, 255, 252, 0.2); /* semi-transparent baby-powder */
		margin-top: 0.5rem; /* Adjusted to account for FormField margin */
		margin-bottom: 0;
	}

	.form-footer {
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		gap: 1.5rem;
		margin-top: 2rem;
	}
</style>
