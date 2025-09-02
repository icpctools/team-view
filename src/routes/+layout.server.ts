import { loadContest } from '$lib/state.svelte.js';
import { error } from '@sveltejs/kit';

export const load = async (_params) => {
	const cc = await loadContest();
	if (!cc) throw error(404);

	if (!cc.getInfo())
		await cc.loadInfo();
	const info = cc.getInfo();
	if (!info) throw error(404);

	return {
		contest: info,
		name: info.formal_name || info.name,
		banner: info.banner,
		logo: info.logo,
	};
};
