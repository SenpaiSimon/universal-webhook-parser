<script lang="ts">
	import { authClient } from '$lib/auth/auth-client';
	import FormField from '$lib/components/forms/FormField.svelte';
	import SubmitButton, {
		type SubmitButtonFormMessage
	} from '$lib/components/forms/SubmitButton.svelte';
	import ContentBox from '$lib/components/layout/ContentBox.svelte';
	import SimpleHeader from '$lib/components/layout/SimpleHeader.svelte';
	import type { Passkey } from '@better-auth/passkey';
	import type { PageData } from './$types';
	import { OIDC_ID } from '$lib/auth/constants';

	let { data }: { data: PageData } = $props();

	async function onPwChange(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const oldPassword = formData.get('oldPassword') as string;
		const password = formData.get('password') as string;
		const password2 = formData.get('password2') as string;
		const revoke = formData.get('revoke') as string;
		const revokeBool = revoke === 'true';

		// password matching?
		if (password !== password2) {
			formMessage = { type: 'error', text: 'Passwords do not match.' };

			setTimeout(() => {
				formMessage = null;
			}, 3000);

			return;
		}

		inProgress = true;
		formMessage = null;

		const { data, error } = await authClient.changePassword({
			newPassword: password,
			currentPassword: oldPassword,
			revokeOtherSessions: revokeBool
		});

		inProgress = false;

		if (error) {
			const text = error.message ? error.message : error.statusText;
			formMessage = {
				type: 'error',
				text
			};

			setTimeout(() => {
				formMessage = null;
			}, 3000);

			return;
		}

		// clear form
		form.reset();

		formMessage = {
			type: 'success',
			text: 'Password changed successfully'
		};

		setTimeout(() => {
			formMessage = null;
		}, 3000);
	}

	async function fetchPasskeys() {
		const res = await authClient.passkey.listUserPasskeys();
		passkeysResult = res.data || [];
	}

	async function deletePasskey(id: string) {
		const { data, error } = await authClient.passkey.deletePasskey({
			id: id // required
		});

		if (error) {
			console.error('Error deleting passkey:', error);
		} else {
			await fetchPasskeys();
		}
	}

	let formMessage: SubmitButtonFormMessage | null = $state(null);
	let inProgress = $state(false);
	let passkeysResult: Passkey[] | null = $state([]);

	$effect(() => {
		fetchPasskeys();
	});
</script>

<SimpleHeader title="Account" />
<ContentBox showToc={true} maxWidth="1200px">
	<p>Hello and Welcome {data.user.name}</p>
	<h1>Change your Password</h1>
	<form class="loginForm" onsubmit={onPwChange}>
		<FormField
			label="Old Password"
			field={{ type: 'password', name: 'oldPassword' }}
			required={true}
		/>
		<FormField
			label="New Password"
			field={{ type: 'password', name: 'password' }}
			required={true}
		/>
		<FormField
			label="Password repeat"
			field={{ type: 'password', name: 'password2' }}
			required={true}
		/>
		<FormField label="Revoke other Sessions" field={{ type: 'checkbox', name: 'revoke' }} />
		<div class="form-actions">
			<SubmitButton
				{formMessage}
				id="register-button"
				text="Update"
				submittingText="Updating..."
				submitting={inProgress}
			/>
		</div>
	</form>

	<h1>Passkeys</h1>
	<div class="form-actions">
		<button
			class="button"
			disabled={inProgress}
			onclick={async () => {
				inProgress = true;

				await authClient.passkey.addPasskey({
					name: data.user?.email || 'unknown user',
					authenticatorAttachment: 'cross-platform',
					fetchOptions: {
						onSuccess(context) {
							fetchPasskeys();
						},
						onError(context) {
							console.error('Error adding passkey:', context.error.message);
						}
					}
				});
				inProgress = false;
			}}
		>
			<div class="button-content" class:loading={inProgress}>
				Create Passkey
				<i class="fa-solid fa-fingerprint"></i>
			</div>
			{#if inProgress}
				<div class="spinner"></div>
			{/if}
		</button>
	</div>
	{#if passkeysResult?.length || 0 > 0}
		{#each passkeysResult as passkey}
			<div class="passkeyRow">
				<div class="passkey-info">
					<span class="passkey-name">{passkey.name}</span>
					<span class="passkey-date">{new Date(passkey.createdAt).toLocaleString()}</span>
				</div>
				<button
					class="revoke-btn"
					onclick={async () => {
						await deletePasskey(passkey.id);
					}}
				>
					Delete
				</button>
			</div>
		{/each}
	{:else}
		<p class="text-center opacity-50 py-2">No passkeys found.</p>
	{/if}

	<h1>OIDC</h1>
	{#if data.oidcSetup}
		<div class="form-actions">
			<button
				class="button"
				disabled={inProgress || data.alreadyLinked}
				onclick={async () => {
					inProgress = true;

					const id = OIDC_ID;

					const { data, error } = await authClient.oauth2.link({
						providerId: id,
						callbackURL: '/login'
					});

					console.log(data, error);

					inProgress = false;
				}}
			>
				{#if data.alreadyLinked}
					<div class="button-content">
						Already linked to {data.oidcSettings?.name}
						{@html data.oidcSettings?.iconSvg}
					</div>
				{:else}
					<div class="button-content" class:loading={inProgress}>
						Link to {data.oidcSettings?.name}
						{@html data.oidcSettings?.iconSvg}
					</div>
				{/if}
				{#if inProgress}
					<div class="spinner"></div>
				{/if}
			</button>
		</div>
	{:else}
		<p>Please setup OIDC in the settings page before using this feature.</p>
	{/if}
</ContentBox>

<style>
	.form-actions {
		/* center the button  */
		display: flex;
		justify-content: center;
	}

	.button {
		background-color: var(--russian-violet);
		color: var(--baby-powder);
		border: 2px solid var(--russian-violet);
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		width: auto;
		margin-bottom: 1.5rem;
	}

	.button:disabled {
		background-color: var(--russian-violet);
		border-color: var(--russian-violet);
		opacity: 0.6;
		cursor: auto;
	}

	.button:not(:disabled):hover {
		border-color: var(--bright-pink-crayola);
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(255, 105, 120, 0.2); /* --bright-pink-crayola glow */
	}

	.button-content {
		display: inline-flex;
		align-items: center;
	}

	.button-content i {
		margin-left: 0.5em;
	}

	.button-content :global(svg) {
		width: 2em;
		height: auto;
		margin-left: 0.5em;
		fill: currentColor;
	}

	.button-content.loading {
		opacity: 0;
	}

	.spinner {
		position: absolute;
		border: 4px solid rgba(253, 255, 252, 0.2); /* --baby-powder with alpha */
		border-radius: 50%;
		border-top-color: var(--baby-blue);
		width: 1.2em;
		height: 1.2em;
		animation: spin 1s ease-in-out infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.passkeyRow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background-color: rgba(255, 255, 255, 0.03);
		width: 100%;
		max-width: 800px;
		margin: 0 auto 0.5rem auto;
		box-sizing: border-box;
	}

	.passkey-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
		min-width: 0;
		margin-right: 1rem;
	}

	.passkey-name {
		color: var(--baby-powder);
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.passkey-date {
		color: var(--baby-powder);
		opacity: 0.6;
		font-size: 0.85rem;
	}

	.revoke-btn {
		background-color: transparent;
		color: var(--delete-red);
		border: 1px solid var(--delete-red);
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}
	.revoke-btn:hover {
		background-color: var(--delete-red);
		color: var(--smoky-black);
	}
	.revoke-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
	.revoke-btn:disabled:hover {
		background-color: transparent;
		color: var(--delete-red);
	}
</style>
