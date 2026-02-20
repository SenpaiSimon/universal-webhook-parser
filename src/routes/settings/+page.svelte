<script lang="ts">
	import Form from '$lib/components/forms/Form.svelte';
	import FormField from '$lib/components/forms/FormField.svelte';
	import ContentBox from '$lib/components/layout/ContentBox.svelte';
	import SimpleHeader from '$lib/components/layout/SimpleHeader.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SimpleHeader title="Settings" />
<ContentBox showToc={true} tocTitle="Settings Sections">
	<h1>Email Settings</h1>

	<Form
		endpoint="?/updateEmailSettings"
		submitButtonText="Update Email Settings"
		submittingText="Updating..."
		maxWidth="600px"
		resetFormOnSuccess={false}
	>
		<input type="hidden" name="id" value={data.emailSettings?.id} />
		<FormField
			label="SMTP Server"
			field={{ type: 'text', name: 'smtpServer' }}
			value={data.emailSettings?.smtpServer}
			required={true}
		/>
		<FormField
			label="SMTP Port"
			field={{ type: 'number', name: 'smtpPort' }}
			value={data.emailSettings?.smtpPort}
			required={true}
		/>
		<FormField
			label="Username"
			field={{ type: 'text', name: 'username' }}
			value={data.emailSettings?.username}
			required={true}
		/>
		<FormField
			label="Password"
			field={{ type: 'password', name: 'password' }}
			value={data.emailSettings?.password}
			required={true}
		/>
		<FormField
			label="From Address - 'Name <mail>' "
			field={{ type: 'text', name: 'fromAddress' }}
			value={data.emailSettings?.fromAddress}
			required={true}
		/>
	</Form>
</ContentBox>
