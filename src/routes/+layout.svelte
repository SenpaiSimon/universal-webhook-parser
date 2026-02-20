<script lang="ts">
	import './app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="site-nav" aria-label="Main navigation">
	<div class="nav-inner">
		<div class="brand">
			<a class="brand-link" href="/">
				<span class="brand-title">Universal Webhook Parser</span>
			</a>
		</div>

		<ul class="nav-links">
			<li><a href="/">Home</a></li>
			<li><a href="/parsers">Parsers</a></li>
			<li><a href="/targets">Targets</a></li>
			<li><a href="/hooks">Hooks</a></li>
			<li><a href="/settings">Settings</a></li>
		</ul>
	</div>
</nav>

<main>
	{@render children()}
</main>

<style>
	.site-nav {
		background: var(--nav-bg, #0f172a);
		color: var(--nav-fg, #fff);
		box-shadow: 0 2px 8px rgba(2, 6, 23, 0.08);
	}
	.nav-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 10px 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.brand-title {
		font-weight: 700;
		font-size: 1.05rem;
		color: inherit;
		text-decoration: none;
	}
	.brand-link {
		text-decoration: none;
		color: inherit;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.nav-links {
		display: flex;
		gap: 8px;
		align-items: center;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.nav-links a {
		color: rgba(255, 255, 255, 0.92);
		text-decoration: none;
		padding: 6px 10px;
		border-radius: 8px;
		font-weight: 600;
	}
	.nav-links a:hover {
		background: rgba(255, 255, 255, 0.04);
	}

	@media (max-width: 640px) {
		.nav-inner {
			flex-direction: column;
			align-items: flex-start;
		}
		.nav-links {
			width: 100%;
			flex-wrap: wrap;
			gap: 6px;
			margin-top: 8px;
		}
		.nav-links a {
			padding: 8px 12px;
		}
	}
</style>
