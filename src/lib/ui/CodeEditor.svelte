<script lang="ts">
	import loader from '@monaco-editor/loader';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import { onDestroy, onMount } from 'svelte';

	interface Props {
		value: string;
		language?: string;
		theme?: string;
	}

	let { value = $bindable(), language = 'text', theme = 'vs-dark' }: Props = $props();

	let editor = $state<Monaco.editor.IStandaloneCodeEditor>();
	let monaco = $state<typeof Monaco>();
	let editorContainer = $state<HTMLElement>();

	onMount(async () => {
		// Remove the next two lines to load the monaco editor from a CDN
		// see https://www.npmjs.com/package/@monaco-editor/loader#config
		const monacoEditor = await import('monaco-editor');
		loader.config({ monaco: monacoEditor.default });

		monaco = await loader.init();

		// monaco instance is ready, let's display some code!
		editor = monaco.editor.create(editorContainer, {
			value,
			language,
			theme,
			automaticLayout: true,
			overviewRulerLanes: 0,
			overviewRulerBorder: false,
			readOnly: true,
			scrollBeyondLastLine: false,
			wordWrap: 'on'
		});
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		monaco?.editor.getModels().forEach((model: any) => model.dispose());
		editor?.dispose();
	});
</script>

<div class="container" bind:this={editorContainer}></div>

<style>
	.container {
		width: 100%;
		height: 600px;
		padding: 0;
		border-radius: 50px;
	}
</style>
