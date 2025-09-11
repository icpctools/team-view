<script lang="ts">
	import { goto } from '$app/navigation';
	import type { MapInfo, Team } from '$lib/contest-types';

	interface Props {
		mapInfo?: MapInfo;
		teams: Team[];
		selected?: string;
	}

	let { mapInfo, teams, selected = $bindable() }: Props = $props();

	let canvas: HTMLCanvasElement;
	let areas = [{}];

	// TODO selection area needs to be a shape/rotated, not just x/y/w/h
	function onMouseMove(event: MouseEvent): void {
		if (!areas || !canvas) {
			return;
		}

		let s: string | undefined = undefined;
		let x = event.pageX - canvas.offsetLeft;
		let y = event.pageY - canvas.offsetTop;

		for (const a of areas) {
			if (x > a.x && y > a.y && x < a.x + a.w && y < a.y + a.h) {
				s = a.id;
				break;
			}
		}

		if (selected !== s) {
			selected = s;
			drawFloor();
		}
	}

	function onClick(): void {
		if (selected) {
			goto('/team/' + selected);
		}
	}

	$effect(() => {
		drawFloor();
	});

	function drawFloor() {
		let c = canvas;
		if (!c) {
			return;
		}

		c.height = window.innerHeight;
		c.width = window.innerWidth;
		var ctx = c.getContext('2d');
		if (ctx == null) {
			return;
		}

		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		let count = 0;
		let minX = 50000,
			minY = 50000;
		let maxX = -50000,
			maxY = -50000;
		for (const team of teams) {
			if (!team.location) {
				continue;
			}
			count++;
			const l = team.location;
			minX = Math.min(minX, l.x);
			minY = Math.min(minY, l.y);
			maxX = Math.max(maxX, l.x);
			maxY = Math.max(maxY, l.y);
		}

		if (count === 0) {
			// no team locations - display a message instead
			ctx.font = '20px Arial';
			ctx.fillText('No map data', c.width / 2, c.height / 2);
			return;
		}

		// buffer a desk's width around the edges
		minX -= 3;
		minY -= 3;
		maxX += 3;
		maxY += 3;

		let dx = maxX - minX;
		let dy = maxY - minY;
		let scale = Math.min(c.width / dx, c.height / dy);

		// center map on canvas
		let ix = -minX * scale;
		let iy = -minY * scale;

		ix += (c.width - dx * scale) / 2;
		iy += (c.height - dy * scale) / 2;

		ctx.translate(ix, iy);

		let desk_width = (mapInfo?.table_width || 1.8) * scale;
		let desk_depth = (mapInfo?.table_depth || 1) * scale;
		let area_width = (mapInfo?.table_area_width || 3) * scale;
		let area_depth = (mapInfo?.table_area_depth || 2.2) * scale;

		// TODO resize font based on canvas size
		ctx.font = '12px Arial';
		ctx.lineWidth = 0.75;

		areas = [];
		for (const team of teams) {
			if (team.location) {
				const l = team.location;

				ctx.strokeStyle = 'black';

				ctx.translate(l.x * scale, l.y * scale);

				let rotation = ((90 - l.rotation) * Math.PI) / 180;
				ctx.rotate(rotation);

				ctx.fillStyle = '#eee';
				ctx.fillRect(-area_width / 2, -area_depth / 2 + desk_depth / 2 + 0.21 * scale, area_width, area_depth);

				if (team.id === selected) {
					ctx.fillStyle = 'gray';
					ctx.fillRect(-desk_width / 2, -desk_depth / 2, desk_width, desk_depth);
					ctx.fillStyle = 'white';
				} else {
					ctx.strokeRect(-desk_width / 2, -desk_depth / 2, desk_width, desk_depth);
					ctx.fillStyle = 'black';
				}
				const r = {
					x: l.x * scale + ix,
					y: l.y * scale + iy,
					w: desk_width,
					h: desk_depth,
					id: team.id
				};
				areas.push(r);
				
				ctx.rotate(-rotation);

				ctx.fillText(team.label, 0, 0);
				ctx.translate(-l.x * scale, -l.y * scale);
			}
		}
	}
</script>

<canvas
	bind:this={canvas}
	id="floor"
	onmousemove={onMouseMove}
	onclick={onClick}
	class="w-full h-full"></canvas>

<svelte:window onresize={drawFloor} />