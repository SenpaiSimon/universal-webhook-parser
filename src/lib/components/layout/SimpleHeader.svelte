<script lang="ts">
	let { title = 'Page' }: { title: string } = $props();
</script>

<header>
	<h1>{title}</h1>
</header>

<style>
	header {
		display: flex;
		align-items: center;
		padding: 1rem 2rem;
		color: var(--baby-powder);
		margin-bottom: 1rem;
		position: relative;
		padding-bottom: 1.5rem; /* Make space for the line */
	}

	/* The gradient line */
	header::after {
		content: '';
		position: absolute;
		bottom: 0.5rem;
		left: 2rem; /* Match header padding */
		width: calc(100% - 4rem); /* Match header padding */
		height: 1px;
		background: linear-gradient(to right, var(--bright-pink-crayola), var(--yellow-green));
		opacity: 0.7;
	}

	h1 {
		margin: 0;
		font-size: 3.5rem;
		font-weight: 600;
		color: var(--baby-powder);
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 2.5rem;
		}
	}
</style>
