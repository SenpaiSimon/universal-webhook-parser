<script lang="ts">
	export type SubmitButtonFormMessage = {
		type: 'success' | 'error';
		text: string;
	};

	let {
		id = 'submit-button',
		submitting = false,
		formMessage = null,
		submittingText = 'Submitting...',
		text = 'Submit'
	}: {
		id?: string;
		submitting?: boolean;
		formMessage?: SubmitButtonFormMessage | null;
		submittingText?: string;
		text?: string;
	} = $props();
</script>

<button {id} type="submit" disabled={submitting} class={formMessage?.type ?? ''}>
	{#if submitting}
		{submittingText}
	{:else}
		{formMessage?.text ?? text}
	{/if}
</button>

<style>
	button {
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
		width: 100%;
		max-width: 320px;
		display: block;
	}

	button:hover {
		border-color: var(--bright-pink-crayola, #ff6978);
	}

	button:disabled {
		cursor: wait;
		opacity: 0.7;
	}

	button.success {
		background-color: var(--yellow-green);
		border-color: var(--yellow-green);
		color: var(--smoky-black);
		transition: all 0.3s ease-in-out;
	}

	button.error {
		background-color: var(--bright-pink-crayola);
		border-color: var(--bright-pink-crayola);
		color: var(--smoky-black);
		transition: all 0.3s ease-in-out;
	}
</style>
