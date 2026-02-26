import type { FileReference } from '@icpctools/contest-api';

export function getFileLanguage(filename: string): string {
	const ext = filename.slice(filename.lastIndexOf('.') + 1);
	switch (ext) {
		case 'ts':
			return 'typescript';

		case 'js':
			return 'javascript';

		case 'py':
			return 'python';

		// some languages match the file extention (e.g. cpp and java) so fallback to this
		default:
			return ext;
	}
}

export async function fetchFileReference(fileRef: FileReference, auth: string): Promise<ArrayBuffer> {
	console.log('Fetching file reference:', fileRef.href);

	const startTime = performance.now();
	const url = fileRef.href;

	const response = await fetch(url, {
		method: 'GET',
		headers: { Authorization: 'Basic ' + auth }
	}).catch((err: unknown) => {
		throw err;
	});
	if (!response.ok) {
		throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
	}

	const arrayBuffer = await response.arrayBuffer();
	if (arrayBuffer.byteLength === 0) {
		throw new Error('Received empty file');
	}
	const endTime = performance.now();
	console.log(`Fetched ${url} in ${(endTime - startTime).toFixed(1)}ms`);
	return arrayBuffer;
}

export async function fetchAndUnzipSubmission(source: FileReference[], auth: string): Promise<Map<string, string>> {
	// Import JSZip dynamically
	const JSZip = (await import('jszip')).default;

	// Fetch the zip file
	const arrayBuffer = await fetchFileReference(source[0], auth);
	const zip = await JSZip.loadAsync(arrayBuffer);

	// Extract all files
	const contents = new Map<string, string>();
	for (const [filename, file] of Object.entries(zip.files)) {
		if (!file.dir) {
			const content = await file.async('string');
			contents.set(filename, content);
		}
	}

	return contents;
}
