
export function getColumns(scoreboard_type: 'pass-fail' | 'score', num_problems: number, showLogo: boolean): string {
	let cols: string[] = ['40px'];
	if (showLogo) {
		cols.push('40px');
	}
	cols.push('425px');

	if (scoreboard_type === 'pass-fail') {
		cols.push('60px');
		cols.push('60px');
	} else if (scoreboard_type === 'score') {
		cols.push('80px');
	}

	for (var i = 0; i < num_problems; i++) {
		cols.push('1fr');
	}

	return cols.join(' ');
}
