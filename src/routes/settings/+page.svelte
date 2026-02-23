<script lang="ts">
	import { resolve } from '$app/paths';
	import { OIDC_ID } from '$lib/auth/constants';
	import Form from '$lib/components/forms/Form.svelte';
	import FormField from '$lib/components/forms/FormField.svelte';
	import ContentBox from '$lib/components/layout/ContentBox.svelte';
	import SimpleHeader from '$lib/components/layout/SimpleHeader.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function getOidcRedirectUri() {
		return `${window.location.origin}/oauth2/callback/${OIDC_ID}`;
	}

	let oidcRedirectUri = $state('');
	let copied = $state(false);

	onMount(() => {
		oidcRedirectUri = getOidcRedirectUri();
	});

	async function copyRedirectUri() {
		if (!oidcRedirectUri) return;
		await navigator.clipboard.writeText(oidcRedirectUri);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
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
		<input type="hidden" name="id" value={data.emailSettings.id} />
		<FormField
			label="SMTP Server"
			field={{ type: 'text', name: 'smtpServer' }}
			value={data.emailSettings.smtpServer}
			required={true}
		/>
		<FormField
			label="SMTP Port"
			field={{ type: 'number', name: 'smtpPort' }}
			value={data.emailSettings.smtpPort}
			required={true}
		/>
		<FormField
			label="Username"
			field={{ type: 'text', name: 'username' }}
			value={data.emailSettings.username}
			required={true}
		/>
		<FormField
			label="Password"
			field={{ type: 'password', name: 'password' }}
			value={data.emailSettings.password}
			required={true}
		/>
		<FormField
			label="From Address - 'Name <mail>' "
			field={{ type: 'text', name: 'fromAddress' }}
			value={data.emailSettings.fromAddress}
			required={true}
		/>
	</Form>

	<h1>OIDC Settings</h1>
	<button class="redirect-uri-box" onclick={copyRedirectUri} type="button" title="Click to copy">
		<span class="label">Redirect URI:</span>
		<code class="uri">{oidcRedirectUri}</code>
		<span class="copy-icon">
			{#if copied}
				<i class="fa-solid fa-check"></i>
			{:else}
				<i class="fa-solid fa-copy"></i>
			{/if}
		</span>
	</button>
	<Form
		endpoint="?/updateOidcSettings"
		submitButtonText="Update OIDC Settings"
		submittingText="Updating..."
		maxWidth="600px"
		resetFormOnSuccess={false}
	>
		<input type="hidden" name="id" value={data.oidcSettings.id} />
		<FormField
			label="Name"
			field={{ type: 'text', name: 'name' }}
			value={data.oidcSettings.name}
			required={true}
		/>
		<FormField
			label="Icon SVG"
			field={{ type: 'text', name: 'iconSvg' }}
			value={data.oidcSettings.iconSvg}
			required={true}
		/>
		<FormField
			label="Full Issuer URL"
			field={{ type: 'text', name: 'issuer' }}
			value={data.oidcSettings.issuer}
			required={true}
		/>
		<FormField
			label="Client ID"
			field={{ type: 'password', name: 'clientId' }}
			value={data.oidcSettings.clientId}
			required={true}
		/>
		<FormField
			label="Client Secret"
			field={{ type: 'password', name: 'clientSecret' }}
			value={data.oidcSettings.clientSecret}
			required={true}
		/>
	</Form>

	<h1>General Settings</h1>
	<Form
		endpoint="?/updateGeneralSettings"
		submitButtonText="Update General Settings"
		submittingText="Updating..."
		maxWidth="600px"
		resetFormOnSuccess={false}
	>
		<input type="hidden" name="id" value={data.generalSettings.id} />
		<FormField
			label="Disable Password Auth"
			field={{ type: 'checkbox', name: 'disablePasswordAuth' }}
			value={data.generalSettings.disablePasswordAuth}
		/>
	</Form>
</ContentBox>

<style>
	.redirect-uri-box {
		display: flex;
		align-items: center;
		gap: 12px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 24px;
		cursor: pointer;
		width: 100%;
		max-width: 600px;
		text-align: left;
		transition: all 0.2s ease;
		color: inherit;
		font-family: inherit;
		font-size: 1rem;
		margin: 2rem auto;
	}

	.redirect-uri-box:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.label {
		font-weight: 600;
		white-space: nowrap;
		color: rgba(255, 255, 255, 0.7);
	}

	.uri {
		color: var(--baby-powder);
		background: rgba(0, 0, 0, 0.2);
		padding: 4px 8px;
		border-radius: 4px;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.copy-icon {
		color: rgba(255, 255, 255, 0.5);
		font-size: 1.1em;
		min-width: 1.2em;
		text-align: center;
	}

	.redirect-uri-box:hover .copy-icon {
		color: #fff;
	}
</style>
