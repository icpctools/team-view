<script lang="ts">
	import type { MapInfo, Team } from '$lib/contest-types';

	interface Props {
		mapInfo?: MapInfo;
		teams: Team[];
		selected?: Team;
		onclick?: (team: Team) => void;
	}

	let { mapInfo, teams, selected = $bindable(), onclick }: Props = $props();

	let canvas: HTMLCanvasElement;
	let scale: number = 1;
	let ix: number = 0;
	let iy: number = 0;

	function onMouseMove(event: MouseEvent): void {
		if (!canvas) {
			return;
		}

		//let x = event.pageX - canvas.offsetLeft;
		//let y = event.pageY - canvas.offsetTop;
		let x = event.offsetX;
		let y = event.offsetY;

		let area_width = (mapInfo?.table_area_width || 3) * scale;
		let area_depth = (mapInfo?.table_area_depth || 2.2) * scale;
		let desk_depth = (mapInfo?.table_depth || 1) * scale;

		x -= ix;
		y -= iy;

		let select: Team | undefined = undefined;
		for (const team of teams) {
			if (team.location) {
				const l = team.location;
				let xx = x - l.x * scale;
				let yy = y - l.y * scale;

				yy -= desk_depth / 2 + 0.21 * scale;

				// TODO rotation
				//let rotation = ((90 - l.rotation) * Math.PI) / 180;
				//ctx.rotate(rotation);

				if (xx > -area_width / 2 && xx < area_width / 2) {
					if (yy > -area_depth / 2 && yy < area_depth / 2) {
						select = team;
						break;
					}
				}
			}
		}

		if (selected?.id !== select?.id) {
			selected = select;
			drawFloor();
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

		// TODO need to set both sizes below to avoid the aspect ratio changing, but
		// should be a way to do this better
		c.width = window.innerWidth;
		c.height = window.innerHeight - 250;

		canvas.style.width = `${c.width}px`
    	canvas.style.height = `${c.height}px`

		let ctx = c.getContext('2d');
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

		// find the biggest scaling so that everything just fits onscreen
		let dx = maxX - minX;
		let dy = maxY - minY;
		scale = Math.min(c.width / dx, c.height / dy);

		// center map on the canvas
		ix = -minX * scale + (c.width - dx * scale) / 2;
		iy = -minY * scale + (c.height - dy * scale) / 2;

		ctx.translate(ix, iy);

		let desk_width = (mapInfo?.table_width || 1.8) * scale;
		let desk_depth = (mapInfo?.table_depth || 1) * scale;
		let area_width = (mapInfo?.table_area_width || 3) * scale;
		let area_depth = (mapInfo?.table_area_depth || 2.2) * scale;

		// resize font based on scale
		ctx.font = Math.round(scale / 2) + 'px Arial';
		ctx.lineWidth = 0.75;

		for (const team of teams) {
			if (team.location) {
				const l = team.location;
				ctx.translate(l.x * scale, l.y * scale);

				let rotation = ((90 - l.rotation) * Math.PI) / 180;
				ctx.rotate(rotation);

				drawTeam(ctx, team.id === selected?.id, area_width, area_depth, desk_width, desk_depth);
				
				ctx.rotate(-rotation);

				ctx.fillText(team.label, 0, 0);
				ctx.translate(-l.x * scale, -l.y * scale);
			}
		}

		if (mapInfo?.spare_teams) {
			for (const l of mapInfo?.spare_teams) {
				ctx.translate(l.x * scale, l.y * scale);

				let rotation = ((90 - l.rotation) * Math.PI) / 180;
				ctx.rotate(rotation);

				drawTeam(ctx, false, area_width, area_depth, desk_width, desk_depth);
				
				ctx.rotate(-rotation);
				//ctx.fillText('S', 0, 0);
				ctx.translate(-l.x * scale, -l.y * scale);
			}
		}
	}

	function drawTeam(ctx: CanvasRenderingContext2D, selected: boolean, area_width:number, area_depth:number, desk_width:number, desk_depth:number): void {
		ctx.fillStyle = '#eee';
		ctx.fillRect(-area_width / 2, -area_depth / 2 + desk_depth / 2 + 0.21 * scale, area_width, area_depth);

		ctx.strokeStyle = 'black';
		if (selected) {
			ctx.fillStyle = 'gray';
			ctx.fillRect(-desk_width / 2, -desk_depth / 2, desk_width, desk_depth);
			ctx.fillStyle = 'white';
		} else {
			ctx.strokeRect(-desk_width / 2, -desk_depth / 2, desk_width, desk_depth);
			ctx.fillStyle = 'black';
		}
	}

	function onClick(): void {
		if (!selected) {
			return;
		}
		onclick?.(selected);
	}
</script>

<canvas
	bind:this={canvas}
	id="floor"
	onmousemove={onMouseMove}
	onclick={onClick}
	class="w-full h-full"></canvas>

<svelte:window onresize={drawFloor} />