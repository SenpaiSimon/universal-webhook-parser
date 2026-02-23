<script lang="ts">
	import { authClient } from '$lib/auth/auth-client';
	import ContentBox from '$lib/components/layout/ContentBox.svelte';
	import SimpleHeader from '$lib/components/layout/SimpleHeader.svelte';
	import type { PageData } from './$types';
	import FormField from '$lib/components/forms/FormField.svelte';
	import SubmitButton, {
		type SubmitButtonFormMessage
	} from '$lib/components/forms/SubmitButton.svelte';
	import { page } from '$app/state';
	import { goto, invalidateAll } from '$app/navigation';
	import { OIDC_ID } from '$lib/auth/constants';

	const next: string = new URLSearchParams(page.url.search).get('next') || '/';

	let { data }: { data: PageData } = $props();

	let title = $derived(data.signUp ? 'Register' : 'Login');

	let formMessage: SubmitButtonFormMessage | null = $state(null);
	let inProgress = $state(false);

	let oidcUnlocked = $derived(data.frontEndOidc.name.length > 0);

	let disablePasswordLogin = $derived(data.disablePasswordLogin);

	async function onSignin(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const password = formData.get('password') as string;
		const email = formData.get('email') as string;

		await authClient.signIn.email(
			{
				email, // user email address
				password // user password -> min 8 characters by default
			},
			{
				onRequest: (ctx) => {
					inProgress = true;
					formMessage = null;
				},
				onSuccess: (ctx) => {
					console.log(ctx);
					inProgress = false;
					window.location.href = next;
				},
				onError: (ctx) => {
					formMessage = {
						type: 'error',
						text: ctx.error.message
					};

					setTimeout(() => {
						formMessage = null;
					}, 3000);

					inProgress = false;
				}
			}
		);
	}

	async function onSignup(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const password = formData.get('password') as string;
		const password2 = formData.get('password2') as string;
		const email = formData.get('email') as string;
		const name = formData.get('username') as string;

		// password matching?
		if (password !== password2) {
			formMessage = { type: 'error', text: 'Passwords do not match.' };

			setTimeout(() => {
				formMessage = null;
			}, 3000);

			return;
		}

		await authClient.signUp.email(
			{
				email, // user email address
				password, // user password -> min 8 characters by default
				name // user display name
			},
			{
				onRequest: (ctx) => {
					inProgress = true;
					formMessage = null;
				},
				onSuccess: (ctx) => {
					inProgress = false;
					window.location.href = next;
				},
				onError: (ctx) => {
					formMessage = {
						type: 'error',
						text: ctx.error.message
					};

					setTimeout(() => {
						formMessage = null;
					}, 3000);

					inProgress = false;
				}
			}
		);
	}
</script>

<SimpleHeader {title} />
<ContentBox maxWidth="500px">
	{#if data.signUp}
		<form class="loginForm" onsubmit={onSignup}>
			<FormField label="Email" field={{ type: 'email', name: 'email' }} required={true} />
			<FormField label="Username" field={{ type: 'text', name: 'username' }} required={true} />
			<FormField label="Password" field={{ type: 'password', name: 'password' }} required={true} />
			<FormField
				label="Password repeat"
				field={{ type: 'password', name: 'password2' }}
				required={true}
			/>
			<div class="form-actions">
				<SubmitButton
					{formMessage}
					id="register-button"
					text="Register"
					submittingText="Registering..."
					submitting={inProgress}
				/>
			</div>
		</form>
	{:else if data.user}
		<h1>Already Logged in</h1>
		<p>Hello {data.user.name}!</p>
		<button
			class="styled-button"
			onclick={async () => {
				await authClient.signOut();
				await invalidateAll();
			}}>Logout</button
		>
	{:else}
		{#if !disablePasswordLogin}
			<form class="loginForm" onsubmit={onSignin}>
				<FormField label="Email" field={{ type: 'email', name: 'email' }} required={true} />
				<FormField
					label="Password"
					field={{ type: 'password', name: 'password' }}
					required={true}
				/>
				<div class="form-actions">
					<SubmitButton
						{formMessage}
						id="register-button"
						text="Login"
						submittingText="Logging in..."
						submitting={inProgress}
					/>
				</div>
			</form>
			<hr class="wide" />
		{/if}
		<div class="alt-logins">
			{#if oidcUnlocked}
				<button
					disabled={inProgress}
					onclick={async () => {
						inProgress = true;
						try {
							await authClient.signIn.oauth2({
								providerId: OIDC_ID,
								callbackURL: next,
								disableRedirect: false
							});
						} catch (error) {
							// If sign-in fails before redirect, re-enable the button
							console.error('Sign-in failed:', error);
							inProgress = false;
						}
					}}
					class="button oidc"
				>
					<div class="button-content" class:loading={inProgress}>
						{data.frontEndOidc.name}
						{@html data.frontEndOidc.icon}
					</div>
					{#if inProgress}
						<div class="spinner"></div>
					{/if}
				</button>
				<hr />
			{/if}
			<button
				class="button secondary"
				disabled={inProgress}
				onclick={async () => {
					inProgress = true;

					await authClient.signIn.passkey({
						autoFill: false,
						fetchOptions: {
							onSuccess(context) {
								// Redirect to dashboard after successful authentication
								window.location.href = next;
							},
							onError(context) {
								// Handle authentication errors
								console.error('Authentication failed:', context.error.message);
							}
						}
					});
					inProgress = false;
				}}
			>
				<div class="button-content" class:loading={inProgress}>
					Use Passkey
					<i class="fa-solid fa-fingerprint"></i>
				</div>

				{#if inProgress}
					<div class="spinner"></div>
				{/if}
			</button>
		</div>
	{/if}
</ContentBox>

<style>
	.oidc :global(svg) {
		width: 2em;
		height: auto;
		margin-left: 0.5em;
		fill: currentColor;
	}

	.button-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	i {
		margin-left: 0.5rem;
	}

	.alt-logins {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.form-actions {
		/* center the button  */
		display: flex;
		justify-content: center;
	}

	.styled-button {
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
		margin: 1rem auto;
	}

	.styled-button:hover {
		border-color: var(--bright-pink-crayola, #ff6978);
	}

	hr {
		width: 100%;
		max-width: 300px;
		margin: 1rem auto;
		color: rgba(255, 255, 255, 0.3);
		border: 0;
		height: 2px;
		border-top: 1px solid rgba(255, 255, 255, 0.3);
	}

	.wide {
		margin: 2rem auto;
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
		display: flex;
		position: relative;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		width: 100%;
		max-width: 320px;
		margin: 0 auto;
	}

	.button:disabled {
		background-color: var(--russian-violet);
		border-color: var(--russian-violet);
		opacity: 0.6;
		cursor: wait;
	}

	.button:not(:disabled):hover {
		border-color: var(--bright-pink-crayola);
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(255, 105, 120, 0.2); /* --bright-pink-crayola glow */
	}

	.button.secondary {
		background-color: rgba(0, 0, 0, 0.2);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.button.secondary:not(:disabled):hover {
		border-color: var(--yellow-green);
		background-color: rgba(255, 255, 255, 0.05);
		box-shadow: 0 4px 15px rgba(155, 197, 61, 0.2); /* --yellow-green glow */
	}

	.button-content.loading {
		opacity: 0; /* Hide content completely */
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
</style>
