<script lang="ts">
	import { enhance } from '$app/forms';
	import Form from './forms/Form.svelte';
	import FormField from './forms/FormField.svelte';
	import ContentBox from './layout/ContentBox.svelte';
	import SimpleHeader from './layout/SimpleHeader.svelte';

	interface Props {
		title: string;
		name: string;
		listItems: {
			id: string;
			title: string;
		}[];
	}

	let { title = 'SomeTitle', name = 'SomeName', listItems = [] }: Props = $props();
	// id of item waiting for confirm click
	let pendingDeleteId = $state('' as string | null);

	function handleDeleteClick(id: string, form?: HTMLFormElement) {
		if (!form) return;

		if (pendingDeleteId === id) {
			// second click: submit
			pendingDeleteId = null;
			// programmatically submit to preserve `use:enhance`
			if (typeof form.requestSubmit === 'function') {
				(form as HTMLFormElement).requestSubmit();
			} else {
				form.submit();
			}
		} else {
			// first click: arm
			pendingDeleteId = id;
			// reset after 3s if user doesn't confirm
			setTimeout(() => {
				if (pendingDeleteId === id) pendingDeleteId = null;
			}, 3000);
		}
	}
</script>

<SimpleHeader {title} />
<ContentBox maxWidth="1200px">
	<h1>Create a new {name}</h1>

	<Form
		endpoint="?/new"
		submitButtonText="New {name}"
		submittingText="Creating..."
		maxWidth="400px"
	>
		<FormField label="{name} Title" field={{ type: 'text', name: 'title' }} required={true} />
	</Form>

	<h2>You have {listItems.length} {name}s</h2>

	<ul class="bacc-list">
		{#each listItems as item}
			<li class="bacc-item">
				<div class="bacc-item-row">
					<a class="bacc-link" href="/{name.toLowerCase()}s/{item.id}">
						{item.title}
						<span class="edit-cta" aria-hidden="true"
							><i class="fa fa-pen" aria-hidden="true"></i></span
						>
						<span class="sr-only">Edit</span>
					</a>
					<form class="bacc-delete-form" method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={item.id} />
						<button
							class="bacc-btn delete"
							class:confirm={pendingDeleteId === item.id}
							type="button"
							onclick={(e) =>
								handleDeleteClick(
									item.id,
									(e.currentTarget as HTMLButtonElement).form as HTMLFormElement
								)}
						>
							{#if pendingDeleteId === item.id}
								Confirm Delete
							{:else}
								Delete
							{/if}
						</button>
					</form>
				</div>
			</li>
		{/each}
	</ul>
</ContentBox>

<style>
	.bacc-btn {
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		border: 0;
		cursor: pointer;
		font-weight: 600;
		background-color: var(--russian-violet, #38023b);
		color: var(--baby-powder, #fdfffc);
		border: 2px solid var(--russian-violet, #38023b);
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease;
	}

	.bacc-btn.delete {
		background: transparent;
		color: var(--bright-pink-crayola, #ff6978);
		border: 1px solid rgba(255, 105, 120, 0.12);
		padding: 0.5rem 0.75rem;
		font-weight: 600;
	}

	.bacc-btn.delete.confirm {
		background-color: var(--bright-pink-crayola, #ff6978);
		border-color: var(--bright-pink-crayola, #ff6978);
		color: var(--smoky-black, #0f172a);
	}

	/* Keep confirmed delete readable on hover */
	.bacc-btn.delete.confirm:hover,
	.bacc-btn.delete.confirm:focus {
		background-color: rgba(255, 105, 120, 0.95);
		border-color: rgba(255, 80, 100, 1);
		color: var(--smoky-black, #0f172a);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	.bacc-btn:hover {
		border-color: var(--bright-pink-crayola, #ff6978);
	}

	.bacc-btn.delete:hover {
		background: rgba(255, 105, 120, 0.06);
	}

	.bacc-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.bacc-item {
		background: rgba(253, 255, 252, 0.03); /* match form background tone */
		padding: 1rem;
		border-radius: 12px;
		border: 1px solid rgba(253, 255, 252, 0.08);
	}
	.bacc-item-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.bacc-link {
		color: var(--baby-blue, #0f62fe);
		text-decoration: none;
		font-weight: 600;
		font-size: 1.05rem;
	}
	.bacc-link:hover {
		text-decoration: underline;
	}

	/* Accessibility helper */
	.sr-only {
		position: absolute !important;
		width: 1px !important;
		height: 1px !important;
		padding: 0 !important;
		margin: -1px !important;
		overflow: hidden !important;
		clip: rect(0, 0, 0, 0) !important;
		white-space: nowrap !important;
		border: 0 !important;
	}

	.bacc-delete-form {
		margin: 0;
	}

	@media (max-width: 520px) {
		.bacc-item-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}
	}
</style>
