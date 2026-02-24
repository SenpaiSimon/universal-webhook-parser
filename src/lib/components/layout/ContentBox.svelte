<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let maxWidth: string = '90%';
	export let showToc: boolean = false;
	export let tocTitle: string = 'Navigation';
	export let showBack: boolean = false;
	export let backRef: string = './';

	type Heading = {
		level: number;
		text: string;
		id: string;
	};

	let headings: Heading[] = [];
	let container: HTMLElement;
	let isTocOpen = false; // Start collapsed by default

	function toggleToc() {
		isTocOpen = !isTocOpen;
	}

	onMount(() => {
		if (!showToc) return; // Don't generate TOC if it's disabled

		const headingElements = Array.from(
			container.querySelectorAll<HTMLHeadingElement>('h1, h2, h3')
		);

		headings = headingElements.map((el, index) => {
			const text = el.innerText;
			const level = parseInt(el.tagName.substring(1));

			// Generate a unique ID from the text content, with a fallback for duplicates
			const slug = text
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^\w-]+/g, '');
			const id = `${slug}-${index}`;
			el.id = id;

			return { text, level, id };
		});
	});
</script>

<div class="content-box" style="width: {maxWidth};" bind:this={container}>
	{#if showBack}
		<div class="back-nav">
			<a href={backRef}>
				<svg
					class="back-icon"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
						clip-rule="evenodd"
					/>
				</svg>
				Back
			</a>
		</div>
	{/if}
	{#if showToc && headings.length > 0}
		<nav class="toc" class:collapsed={!isTocOpen}>
			<button
				class="toc-title"
				onclick={toggleToc}
				aria-expanded={isTocOpen}
				aria-controls="toc-list"
				type="button"
			>
				{tocTitle}
				<svg
					class="toc-toggle-icon"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
					><path
						fill-rule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clip-rule="evenodd"
					></path></svg
				>
			</button>
			{#if isTocOpen}
				<ul id="toc-list" transition:slide={{ duration: 250 }}>
					{#each headings as heading}
						<li class="toc-item-level-{heading.level}">
							<a href="#{heading.id}">{heading.text}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</nav>
	{/if}
	<div class="content">
		<slot />
	</div>
</div>

<style>
	.content > :global(h1:first-child) {
		margin-top: 1rem;
	}

	.content > :global(h1) {
		margin-top: 4rem;
		font-size: 2em;
	}
	.content > :global(h2) {
		margin-top: 3rem;
		font-size: 2em;
	}
	.content > :global(h3) {
		margin-top: 2rem;
		font-size: 2em;
	}
	.content > :global(h4) {
		margin-top: 1rem;
		font-size: 2em;
	}

	@media (max-width: 768px) {
		.content > :global(h1) {
			font-size: 1.5em;
		}
		.content > :global(h2) {
			font-size: 1.2em;
		}
		.content > :global(h3) {
			font-size: 1em;
		}
		.content > :global(h4) {
			font-size: 1em;
		}
	}

	.content > :global(h1::before) {
		content: '> ';
		color: var(--baby-blue);
	}

	.content > :global(h2::before) {
		content: '> ';
		color: var(--baby-blue);
	}

	.content > :global(h3::before) {
		content: '> ';
		color: var(--baby-blue);
	}

	.content > :global(h4::before) {
		content: '> ';
		color: var(--baby-blue);
	}

	.content-box {
		display: flex;
		flex-direction: column;
		gap: 1.5rem; /* Adjust the space between items inside the box */

		background-color: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 15px; /* Rounded corners */
		padding: 2rem;
		backdrop-filter: blur(8px);

		margin: 0 auto; /* Center the box horizontally */
		margin-bottom: 2rem;
	}

	.toc {
		background-color: rgba(15, 17, 8, 0.5); /* --smoky-black with alpha */
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		padding: 1rem 1.5rem;
		transition: all 0.2s ease-in-out;
	}

	.toc.collapsed {
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}

	.toc-title {
		/* Reset button styles */
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		text-align: left;
		width: 100%;
		/* Original h2 styles */
		position: relative;
		margin: 0 0 0.75rem 0;
		font-size: 2rem;
		color: var(--baby-powder);
		border-bottom: 1px solid rgb(from var(--yellow-green) r g b / 0.3);
		padding-bottom: 1rem;
		cursor: pointer;
		user-select: none;
	}

	.toc.collapsed .toc-title {
		margin-bottom: 0;
		border-bottom: none;
		padding-bottom: 0;
	}

	.toc-toggle-icon {
		position: absolute;
		right: 0.5rem;
		top: calc(50% - 0.125rem); /* Fine-tune vertical alignment */
		transform: translateY(-50%) rotate(180deg);
		width: 1.5rem;
		height: 1.5rem;
		color: var(--baby-powder);
		transition: transform 0.2s ease-in-out;
	}

	.toc.collapsed .toc-toggle-icon {
		transform: translateY(-50%) rotate(0deg);
	}

	.toc ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.toc-item-level-2 {
		padding-left: 1rem;
	}

	.toc-item-level-3 {
		padding-left: 2rem;
	}

	:global(.content-box p) {
		color: var(--baby-powder);
		font-size: 1.4rem;
		line-height: 1.5;
		margin: 0; /* Let the 'gap' property handle vertical spacing */
		opacity: 0.9; /* Slightly softer text for better readability */
		text-align: left;
		margin-bottom: 1vh;
		hyphens: auto;
		word-break: break-word;
	}

	@media (max-width: 768px) {
		:global(.content-box p) {
			font-size: 1.1rem !important;
		}
	}

	:global(.content-box a) {
		text-decoration: underline;
		color: var(--baby-blue);
		font-size: 1.2rem;
		line-height: 1.5;
	}

	:global(i) {
		color: var(--yellow-green);
		font-size: 1.6rem;
		transition: ease-in-out 0.3s;
	}

	:global(i:hover) {
		scale: 1.2;
	}

	:global(bold) {
		color: var(--yellow-green);
	}

	:global(space) {
		margin: 3rem;
		display: block;
	}

	.back-nav a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		font-weight: bold;
	}

	.back-nav a:hover {
		text-decoration: underline;
	}

	.back-icon {
		width: 1.2rem;
		height: 1.2rem;
	}
</style>
