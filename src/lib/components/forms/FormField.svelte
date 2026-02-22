<script lang="ts">
	export type FormFieldDropdownOption = {
		label: string;
		value: any;
	};

	export type OptionType = 'checkbox' | 'dropdown' | 'file' | 'text' | 'textarea';

	export type FormFieldOptions = {
		type: OptionType;
		name: string;
		maxFiles?: number;
		accept?: string;
		dropdownOptions?: FormFieldDropdownOption[];
	};

	let {
		field,
		label,
		value = $bindable(),
		required = false,
		onChange = (event: Event) => {}
	}: {
		field: FormFieldOptions;
		label: string;
		value?: any;
		required?: boolean;
		onChange?: (event: Event) => void;
	} = $props();

	function autoResize(node: HTMLTextAreaElement, _value: any) {
		node.style.overflow = 'hidden';
		const resize = () => {
			node.style.height = 'auto';
			node.style.height = node.scrollHeight + 'px';
		};
		node.addEventListener('input', resize);
		resize();
		return {
			destroy() {
				node.removeEventListener('input', resize);
			},
			update(_newValue: any) {
				resize();
			}
		};
	}
</script>

<div class="form-field" class:checkbox={field.type === 'checkbox'}>
	<label for={field.name}>{label}</label>
	{#if field.type === 'checkbox'}
		<!-- This hidden input ensures a value is always submitted for the checkbox -->
		<input type="hidden" name={field.name} value={value || false} />
		<input type="checkbox" id={field.name} bind:checked={value} {required} onchange={onChange} />
	{:else if field.type === 'dropdown'}
		<select id={field.name} name={field.name} {required} onchange={onChange} bind:value>
			{#if field.dropdownOptions}
				{#each field.dropdownOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			{/if}
		</select>
	{:else if field.type === 'file'}
		<input
			type="file"
			id={field.name}
			name={field.name}
			bind:value
			{required}
			onchange={onChange}
			max={field.maxFiles ? field.maxFiles : 1}
			multiple={field.maxFiles ? true : false}
			accept={field.accept ? field.accept : ''}
		/>
	{:else if field.type === 'textarea'}
		<textarea
			id={field.name}
			name={field.name}
			bind:value
			{required}
			onchange={onChange}
			use:autoResize={value}
		></textarea>
	{:else}
		<input
			type={field.type}
			id={field.name}
			name={field.name}
			bind:value
			{required}
			onchange={onChange}
		/>
	{/if}
</div>

<style>
	.form-field {
		display: flex;
		flex-direction: column;
		margin-bottom: 1.5rem;
	}

	.form-field.checkbox {
		/* For checkboxes, display the label to the right of the box */
		flex-direction: row;
		align-items: center;
		gap: 1.75rem;
		justify-content: flex-start;
	}

	label {
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
		color: var(--baby-powder);
		font-weight: 500;
	}

	.checkbox label {
		margin-bottom: 0;
	}

	input,
	select,
	textarea {
		background-color: rgba(253, 255, 252, 0.05); /* transparent baby-powder */
		border: 1px solid rgba(253, 255, 252, 0.2);
		border-radius: var(--border-radius, 8px);
		padding: 0.75rem 1rem;
		font-size: 1rem;
		color: var(--baby-powder);
		transition:
			border-color 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
	}

	.checkbox input {
		/* Make checkbox larger and easier to click */
		width: 1.25em;
		height: 1.25em;
		margin: 0;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--baby-blue);
		box-shadow: 0 0 0 3px rgba(162, 210, 255, 0.25); /* baby-blue glow */
	}

	option {
		background-color: #222;
		color: var(--baby-powder);
	}

	textarea {
		min-height: 6rem;
		resize: none;
	}
</style>
