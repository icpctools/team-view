/**
 * Copyright later.
 */
export const PENDING = rgbToHex([66, 114, 245]);
export const FAILED = rgbToHex([240, 0, 0]);
export const SOLVED = rgbToHex([0, 230, 0]);
export const SCORING_MID = rgbToHex([210, 210, 0]);
export const FIRST_TO_SOLVE = rgbToHex([0, 100, 0]);

export function parseHexColor(hex: string): [number, number, number] | [number, number, number, number] {
	// remove the '#' if present
	const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;

	let r: number, g: number, b: number, a: number | undefined;

	if (cleanHex.length === 3) {
		// handle shorthand hex (e.g., #FFF)
		r = parseInt(cleanHex[0] + cleanHex[0], 16);
		g = parseInt(cleanHex[1] + cleanHex[1], 16);
		b = parseInt(cleanHex[2] + cleanHex[2], 16);
	} else if (cleanHex.length === 6) {
		// handle full hex (e.g., #RRGGBB)
		r = parseInt(cleanHex.slice(0, 2), 16);
		g = parseInt(cleanHex.slice(2, 4), 16);
		b = parseInt(cleanHex.slice(4, 6), 16);
	} else if (cleanHex.length === 8) {
		// handle hex with alpha (e.g., #RRGGBBAA)
		r = parseInt(cleanHex.slice(0, 2), 16);
		g = parseInt(cleanHex.slice(2, 4), 16);
		b = parseInt(cleanHex.slice(4, 6), 16);
		a = parseInt(cleanHex.slice(6, 8), 16);
	} else {
		throw new Error('Invalid hex color format.');
	}

	if (a !== undefined) {
		return [r, g, b, a];
	} else {
		return [r, g, b];
	}
}

export function darker(color: number[]): number[] {
	let darker: number[] = [];
	darker.push(Math.max(color[0] - 64, 0));
	darker.push(Math.max(color[1] - 64, 0));
	darker.push(Math.max(color[2] - 64, 0));
	if (color.length === 4)
		darker.push(color[3]);

	return darker;
}

export function rgbToHex(color: number[]): string {
	return '#' + colorToHex(color[0]) + colorToHex(color[1]) + colorToHex(color[2]);
}

export function colorToHex(c: number): string {
	const hex = Math.floor(c).toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}
