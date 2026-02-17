<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div>
	<h1>Parsers</h1>
	{#if form?.error}
		<p style="color: red">{form.error}</p>
	{/if}
	{#if form?.success}
		<p style="color: green">Nice</p>
	{/if}
	<form method="POST" action="?/new" use:enhance>
		<input type="text" name="title" placeholder="Enter parser title" />

		<button type="submit">New Parser</button>
	</form>

	<h1>You have {data.parsers.length} parsers</h1>
	<ul>
		{#each data.parsers as parser}
			<li>
				<div>
					<a href="/parsers/{parser.id}">{parser.title}</a>
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={parser.id} />
						<button type="submit">Delete</button>
					</form>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
</style>
