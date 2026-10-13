import type { AnimationConfig } from 'svelte/animate';

/**
 * A drop-in replacement for Svelte's `flip` animation that moves rows with a simple physical
 * motion instead of a fixed-duration easing curve.
 *
 * Each move accelerates at a constant rate up to a maximum speed, coasts there if the distance
 * is long enough, then decelerates at the same rate to stop exactly on the target. Because the
 * duration falls out of the physics, rows travelling shorter distances arrive sooner.
 *
 * When a move is interrupted (a reload retargets a row mid-flight), the row's current speed is
 * carried over as the starting speed of the new profile, so the motion stays continuous with no
 * velocity jump. A row already heading the wrong way decelerates, stops, and comes back; a row
 * moving faster than can stop in the remaining distance decelerates harder so it never overshoots
 * the target.
 *
 * Position is animated purely with `translate`, so the animation runs on the compositor and keeps
 * moving smoothly even while the main thread is busy applying reloads.
 */

interface SmoothFlipParams {
	delay?: number;
	/**
	 * Overall speed multiplier. Keeps the exact same motion profile, just time-compressed.
	 */
	speed?: number;
}

// Tuned (at the default speed of 1) so a large reorder (~400px) takes ~0.6s and a single-row move
// (~40px) takes ~0.2s.
const DEFAULT_ACCEL = 0.0045;
const DEFAULT_MAX_SPEED = 1.2;

// A constant-acceleration segment of the motion, expressed in terms of `dist` = distance still to
// travel to the target (starts at the initial distance, ends at 0) and its rate of change `vd`.
interface Phase {
	dur: number; // ms
	acc: number; // d²(dist)/dt²
	vd0: number; // d(dist)/dt at the start of the phase
	d0: number; // dist at the start of the phase
}

interface Trajectory {
	start: number; // performance.now() when the animation began
	total: number; // total duration in ms
	dirX: number; // unit vector from target toward the start position
	dirY: number;
	phases: Phase[];
}

const trajectories = new WeakMap<Element, Trajectory>();

// Build the phases that take `dist` from D0 down to 0, ending at rest, starting with rate vd0
// (positive = currently moving away from the target).
function buildPhases(D0: number, vd0: number, accel: number, maxSpeed: number): Phase[] {
	const phases: Phase[] = [];
	let d = D0;

	// If we're moving away from the target, decelerate that motion to a stop first.
	if (vd0 > 0) {
		const dur = vd0 / accel;
		phases.push({ dur, acc: -accel, vd0, d0: d });
		d += (vd0 * vd0) / (2 * accel); // travelled further away before stopping
	}

	// Now heading toward the target (or at rest). u = current speed toward the target.
	const u = Math.min(vd0 < 0 ? -vd0 : 0, maxSpeed);
	const R = d;
	const stopDist = (u * u) / (2 * accel);

	if (u > 0 && stopDist >= R) {
		// Too fast to stop within the remaining distance at the normal rate: brake harder so we
		// land exactly on the target instead of overshooting.
		const brake = (u * u) / (2 * R);
		phases.push({ dur: u / brake, acc: brake, vd0: -u, d0: R });
		return phases;
	}

	// Accelerate toward the target, then decelerate to a stop.
	const peak = Math.sqrt(accel * R + (u * u) / 2);
	if (peak <= maxSpeed) {
		const durAcc = (peak - u) / accel;
		const dMid = d + -u * durAcc + 0.5 * -accel * durAcc * durAcc;
		phases.push({ dur: durAcc, acc: -accel, vd0: -u, d0: d });
		phases.push({ dur: peak / accel, acc: accel, vd0: -peak, d0: dMid });
	} else {
		const durAcc = (maxSpeed - u) / accel;
		const dAfterAcc = d + -u * durAcc + 0.5 * -accel * durAcc * durAcc;
		const decelDist = (maxSpeed * maxSpeed) / (2 * accel);
		const coastDist = dAfterAcc - decelDist;
		const durCoast = coastDist / maxSpeed;
		const dAfterCoast = dAfterAcc + -maxSpeed * durCoast;
		phases.push({ dur: durAcc, acc: -accel, vd0: -u, d0: d });
		phases.push({ dur: durCoast, acc: 0, vd0: -maxSpeed, d0: dAfterAcc });
		phases.push({ dur: maxSpeed / accel, acc: accel, vd0: -maxSpeed, d0: dAfterCoast });
	}
	return phases;
}

// Sample dist and its rate at time `t` (ms) within the profile.
function sample(phases: Phase[], t: number): { dist: number; vd: number } {
	let base = 0;
	for (let i = 0; i < phases.length; i++) {
		const ph = phases[i];
		if (t <= base + ph.dur || i === phases.length - 1) {
			const tau = Math.max(0, Math.min(ph.dur, t - base));
			return {
				dist: ph.d0 + ph.vd0 * tau + 0.5 * ph.acc * tau * tau,
				vd: ph.vd0 + ph.acc * tau
			};
		}
		base += ph.dur;
	}
	return { dist: 0, vd: 0 };
}

export function smoothFlip(
	node: Element,
	{ from, to }: { from: DOMRect; to: DOMRect },
	params: SmoothFlipParams = {}
): AnimationConfig {
	// Velocity scales by `speed` and acceleration by `speed`, which keeps the motion profile's shape
	// identical and just time-compresses it.
	const { delay = 0, speed = 1 } = params;
	const accel = DEFAULT_ACCEL * speed * speed;
	const maxSpeed = DEFAULT_MAX_SPEED * speed;

	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	// Current on-screen offset from the target (Svelte measures `from` live, so this is correct
	// mid-interruption) and its magnitude / direction.
	const dx = from.left - to.left;
	const dy = from.top - to.top;
	const D0 = Math.hypot(dx, dy);
	if (D0 < 0.5) {
		return { delay, duration: 0, css: () => `transform: ${transform};` };
	}
	const dirX = dx / D0;
	const dirY = dy / D0;

	// Rows moving up the screen (dy > 0: they start below their target and slide up, i.e. climbing
	// the ranking) are lifted above the rows they slide over. Scaling by distance keeps the biggest
	// climbers on top of smaller ones, drawing focus to rows surging up.
	const zStyle = dy > 0 ? ` z-index: ${Math.round(dy)};` : '';

	// Carry the current velocity over from the animation we're interrupting, projected onto the
	// new direction of travel. Positive = still moving away from the (new) target.
	const now = performance.now();
	const prev = trajectories.get(node);
	let vd0 = 0;
	if (prev) {
		const { vd } = sample(prev.phases, Math.max(0, now - prev.start));
		const vx = vd * prev.dirX;
		const vy = vd * prev.dirY;
		vd0 = vx * dirX + vy * dirY;
	}

	const phases = buildPhases(D0, vd0, accel, maxSpeed);
	const total = Math.max(
		1,
		phases.reduce((sum, ph) => sum + ph.dur, 0)
	);

	trajectories.set(node, { start: now, total, dirX, dirY, phases });

	return {
		delay,
		duration: total,
		easing: (t) => t, // linear: our profile already shapes the motion, css `t` is raw progress
		css: (t) => {
			const { dist } = sample(phases, t * total);
			return `transform: ${transform} translate(${dist * dirX}px, ${dist * dirY}px);${zStyle}`;
		}
	};
}
