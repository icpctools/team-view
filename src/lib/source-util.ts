import type { FileReference } from '@icpctools/contest-api';

export async function fetchAndUnzipSubmission(source: FileReference[]): Promise<Map<string, string>> {
	const contents = new Map<string, string>();
	const url = source[0].href;

	// Import JSZip dynamically
	const JSZip = (await import('jszip')).default;

	console.log('Fetching submission:', url);

	// Fetch the zip file
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const response = await fetch(url).catch((err: any) => {
		throw new Error(`Failed to fetch: ${err}`);
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch submission: ${response.status} ${response.statusText}`);
	}

	// Get as ArrayBuffer instead of Blob and confirm it's not empty
	const arrayBuffer = await response.arrayBuffer();
	if (arrayBuffer.byteLength === 0) {
		throw new Error('Received empty file');
	}

	const zip = await JSZip.loadAsync(arrayBuffer);

	// Extract all files
	for (const [filename, file] of Object.entries(zip.files)) {
		if (!file.dir) {
			const content = await file.async('string');
			contents.set(filename, content);
		}
	}

	return contents;
}
