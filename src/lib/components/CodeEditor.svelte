<script lang="ts">
	import loader from '@monaco-editor/loader';
	import type * as Monaco from 'monaco-editor';
	import { onDestroy, onMount, setContext } from 'svelte';

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;
	let markersListener: Monaco.IDisposable | undefined;

	let loading = $state(true);

	// Define props with Svelte 5 syntax
	interface Props {
		value: string;
		hasErrors: boolean;
		language?: string;
		theme?: string;
		contextSnippet?: string;
	}

	let {
		value = $bindable(),
		hasErrors = $bindable(),
		language = 'html',
		theme = 'vs-dark',
		contextSnippet = ''
	}: Props = $props();

	onMount(() => {
		(async () => {
			try {
				// Remove the next two lines to load the monaco editor from a CDN
				// see https://www.npmjs.com/package/@monaco-editor/loader#config
				const monacoEditor = await import('monaco-editor');
				loader.config({ monaco: monacoEditor.default });

				monaco = await loader.init();

				// set the types for the editor's model to include our context snippet
				if (contextSnippet) {
					monaco.typescript.typescriptDefaults.addExtraLib(contextSnippet, 'context.d.ts');
				}

				// Your monaco instance is ready, let's display some code!
				editor = monaco.editor.create(editorContainer, {
					value,
					language,
					theme,
					automaticLayout: true,
					padding: { top: 12 },
					overviewRulerLanes: 0,
					overviewRulerBorder: false,
					wordWrap: 'on'
				});

				editor.onDidChangeModelContent((e) => {
					if (e.isFlush) {
						// true if setValue call
						//console.log('setValue call');
						/* editor.setValue(value); */
					} else {
						// console.log('user input');
						const updatedValue = editor?.getValue() ?? ' ';
						value = updatedValue;
					}
				});

				// Watch diagnostics/markers for this editor's model and report errors
				const model = editor.getModel();

				const updateHasErrors = () => {
					if (!model) return;
					const allMarkers = monaco.editor.getModelMarkers({});
					const myMarkers = allMarkers.filter(
						(m) => m.resource?.toString() === model.uri.toString()
					);
					hasErrors = myMarkers.some((m) => m.severity === monaco.MarkerSeverity.Error);
				};

				markersListener = monaco.editor.onDidChangeMarkers(() => updateHasErrors());
				updateHasErrors();
			} finally {
				loading = false;
			}
		})();
	});

	$effect(() => {
		if (value) {
			if (editor) {
				// check if the editor is focused
				if (editor.hasWidgetFocus()) {
					// let the user edit with no interference
				} else {
					if (editor?.getValue() ?? ' ' !== value) {
						editor?.setValue(value);
					}
				}
			}
		}
		if (value === '') {
			editor?.setValue(' ');
		}
	});

	onDestroy(() => {
		markersListener?.dispose();
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});
</script>

<div class="editor-wrapper">
	{#if loading}
		<div class="spinner-overlay" aria-hidden="true">
			<div class="spinner"></div>
		</div>
	{/if}
	<div class="container" bind:this={editorContainer}></div>
</div>

<style>
	.editor-wrapper {
		position: relative;
		width: 100%;
		height: 400px;
	}

	.container {
		width: 100%;
		height: 100%;
		padding: 0;
		border-radius: 12px;
		overflow: hidden;
	}

	.spinner-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(2px);
		z-index: 10;
	}

	.spinner {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 6px solid rgba(255, 255, 255, 0.15);
		border-top-color: #ffffff;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
