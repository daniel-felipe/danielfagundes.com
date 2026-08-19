import { Mesh, Program, Renderer, Triangle } from 'ogl';

const PAD = 20;

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;
uniform float uBaseStrength;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = sdRoundedRect(p, uHalfSize, uRadius);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * uBaseStrength;

  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}
`;

type SpecularInstance = {
	btn: HTMLElement;
	host: HTMLElement;
	renderer: Renderer;
	program: Program;
	mesh: Mesh;
	inView: boolean;
	angle: number;
	idleAngle: number;
	bright: number;
	w: number;
	h: number;
	dpr: number;
	intensity: number;
	thickness: number;
	radius: number;
};

function luminance(rgb: [number, number, number]): number {
	return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function parseRgb(color: string): [number, number, number] {
	const parts = color.match(/[\d.]+/g);
	if (!parts || parts.length < 3) return [1, 1, 1];
	return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255];
}

function cssRgb(name: string): [number, number, number] {
	const probe = document.createElement('span');
	probe.style.color = `var(${name})`;
	document.body.appendChild(probe);
	const color = getComputedStyle(probe).color;
	probe.remove();
	return parseRgb(color);
}

function lookFor(fill: [number, number, number], accent: [number, number, number], slate: [number, number, number]) {
	if (luminance(fill) > 0.55) {
		return {
			line: slate,
			base: [0.32, 0.32, 0.38] as [number, number, number],
			intensity: 2.05,
			thickness: 1.7,
			baseStrength: 0.34,
			shineSize: (13 * Math.PI) / 180,
			shineFade: (30 * Math.PI) / 180,
		};
	}

	return {
		line: [
			Math.min(1, 0.78 + accent[0] * 0.28),
			Math.min(1, 0.78 + accent[1] * 0.28),
			Math.min(1, 0.78 + accent[2] * 0.28),
		] as [number, number, number],
		base: [0.32, 0.32, 0.32] as [number, number, number],
		intensity: 2.15,
		thickness: 1.6,
		baseStrength: 0.5,
		shineSize: (11 * Math.PI) / 180,
		shineFade: (32 * Math.PI) / 180,
	};
}

function mount(btn: HTMLElement, compact: boolean): SpecularInstance | null {
	const host = btn.querySelector<HTMLElement>('.button-fx');
	if (!host) return null;

	const canvas = document.createElement('canvas');
	host.appendChild(canvas);

	let renderer: Renderer;
	try {
		renderer = new Renderer({
			canvas,
			dpr: 1,
			alpha: true,
			depth: false,
			antialias: false,
			premultipliedAlpha: true,
			powerPreference: 'low-power',
		});
	} catch {
		canvas.remove();
		return null;
	}

	const gl = renderer.gl;
	if (!gl) {
		canvas.remove();
		return null;
	}

	gl.clearColor(0, 0, 0, 0);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

	const geometry = new Triangle(gl);
	if (geometry.attributes.uv) delete geometry.attributes.uv;

	const program = new Program(gl, {
		vertex: VERT,
		fragment: FRAG,
		transparent: true,
		depthTest: false,
		depthWrite: false,
		uniforms: {
			uCenter: { value: [0, 0] },
			uHalfSize: { value: [1, 1] },
			uRadius: { value: 0 },
			uAngle: { value: 2.4 },
			uPx: { value: 1 },
			uLineColor: { value: [1, 1, 1] },
			uBaseColor: { value: [0.32, 0.32, 0.32] },
			uIntensity: { value: 0 },
			uShineSize: { value: (12 * Math.PI) / 180 },
			uShineFade: { value: (38 * Math.PI) / 180 },
			uThickness: { value: 1 },
			uBaseWidth: { value: 1 },
			uBaseStrength: { value: 0.45 },
		},
	});

	return {
		btn,
		host,
		renderer,
		program,
		mesh: new Mesh(gl, { geometry, program }),
		inView: true,
		angle: 2.4,
		idleAngle: 2.4,
		bright: 0,
		w: 1,
		h: 1,
		dpr: 1,
		intensity: 1.2,
		thickness: 1.15,
		radius: 0,
	};
}

function resize(inst: SpecularInstance, compact: boolean) {
	const rect = inst.btn.getBoundingClientRect();
	const w = rect.width;
	const h = rect.height;
	if (w < 2 || h < 2) return;

	inst.w = w;
	inst.h = h;
	inst.dpr = Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.75);
	inst.renderer.dpr = inst.dpr;
	inst.renderer.setSize(w + PAD * 2, h + PAD * 2);

	const canvas = inst.renderer.gl.canvas as HTMLCanvasElement;
	canvas.style.width = '100%';
	canvas.style.height = '100%';

	inst.program.uniforms.uCenter.value = [(PAD + w / 2) * inst.dpr, (PAD + h / 2) * inst.dpr];
	inst.program.uniforms.uHalfSize.value = [(w / 2) * inst.dpr, (h / 2) * inst.dpr];
	inst.program.uniforms.uPx.value = inst.dpr;
	inst.program.uniforms.uBaseWidth.value = inst.dpr;
	inst.program.uniforms.uThickness.value = inst.thickness * inst.dpr;
	inst.radius = Math.min(
		parseFloat(getComputedStyle(inst.btn).borderRadius) || h / 2,
		h / 2,
	);
}

function syncColors(
	inst: SpecularInstance,
	accent: [number, number, number],
	slate: [number, number, number],
) {
	const fill = parseRgb(getComputedStyle(inst.btn).backgroundColor);
	const look = lookFor(fill, accent, slate);
	inst.intensity = look.intensity;
	inst.thickness = look.thickness;
	inst.program.uniforms.uLineColor.value = look.line;
	inst.program.uniforms.uBaseColor.value = look.base;
	inst.program.uniforms.uBaseStrength.value = look.baseStrength;
	inst.program.uniforms.uShineSize.value = look.shineSize;
	inst.program.uniforms.uShineFade.value = look.shineFade;
	inst.program.uniforms.uThickness.value = inst.thickness * inst.dpr;
}

export function initSpecularButtons(): void {
	const buttons = Array.from(
		document.querySelectorAll<HTMLElement>('.button-primary, .button-secondary'),
	);
	if (!buttons.length) return;

	const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
	const followMouse = window.matchMedia('(pointer: fine)').matches;
	const autoAnimate = !followMouse;
	const speed = compact ? 0.28 : 0.35;
	const proximity = compact ? 160 : 240;

	const instances = buttons
		.map((btn) => mount(btn, compact))
		.filter((inst): inst is SpecularInstance => inst !== null);
	if (!instances.length) return;

	let accent = cssRgb('--accent');
	let slate = cssRgb('--accent-slate');
	const pointer = { x: 0, y: 0, seen: false };
	let playing = false;
	let frame = 0;
	let last = 0;
	let resizeRaf = 0;

	const play = () => {
		if (playing) return;
		playing = true;
		last = 0;
		frame = requestAnimationFrame(loop);
	};

	const pause = () => {
		if (!playing) return;
		playing = false;
		cancelAnimationFrame(frame);
		frame = 0;
	};

	const syncPlayback = () => {
		if (document.hidden) {
			pause();
			return;
		}
		if (instances.some((inst) => inst.inView)) play();
		else pause();
	};

	const loop = (now: number) => {
		frame = requestAnimationFrame(loop);
		if (now - last < 1000 / 24 && last) return;
		const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
		last = now;

		let need = false;
		for (const inst of instances) {
			if (!inst.inView) continue;

			const rect = inst.btn.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const dx = Math.max(rect.left - pointer.x, 0, pointer.x - rect.right);
			const dy = Math.max(rect.top - pointer.y, 0, pointer.y - rect.bottom);
			const dist = Math.hypot(dx, dy);

			let pointerAngle: number | null = null;
			let proximityT = 0;
			if (followMouse && pointer.seen) {
				if (dist === 0) {
					const nx = (pointer.x - cx) / Math.max(rect.width / 2, 1);
					const ny = (cy - pointer.y) / Math.max(rect.height / 2, 1);
					pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
				} else {
					pointerAngle = Math.atan2(cy - pointer.y, pointer.x - cx);
				}
				const t = Math.max(0, 1 - dist / proximity);
				proximityT = t * t * (3 - 2 * t);
			}

			inst.idleAngle += speed * dt;
			const steer = followMouse && pointerAngle != null && (!autoAnimate || proximityT > 0);
			const target = steer ? pointerAngle! : inst.idleAngle;
			const diff = ((target - inst.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
			inst.angle += diff * (1 - Math.exp(-dt * 7));

			const brightTarget = autoAnimate ? 1 : proximityT;
			inst.bright += (brightTarget - inst.bright) * (1 - Math.exp(-dt * 8));

			if (!autoAnimate && inst.bright < 0.004 && brightTarget < 0.004) continue;

			inst.program.uniforms.uAngle.value = inst.angle;
			inst.program.uniforms.uRadius.value = inst.radius * inst.dpr;
			inst.program.uniforms.uIntensity.value = inst.intensity * inst.bright;
			inst.renderer.render({ scene: inst.mesh });

			if (autoAnimate || inst.bright > 0.004 || brightTarget > 0.004) need = true;
		}

		if (!need) pause();
	};

	const onResize = () => {
		if (resizeRaf) return;
		resizeRaf = requestAnimationFrame(() => {
			resizeRaf = 0;
			instances.forEach((inst) => resize(inst, compact));
		});
	};

	instances.forEach((inst) => {
		resize(inst, compact);
		syncColors(inst, accent, slate);
	});

	const ro = new ResizeObserver(onResize);
	instances.forEach((inst) => ro.observe(inst.btn));

	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const inst = instances.find((item) => item.btn === entry.target);
				if (inst) inst.inView = entry.isIntersecting;
			});
			syncPlayback();
		},
		{ threshold: 0.08 },
	);
	instances.forEach((inst) => io.observe(inst.btn));

	const theme = new MutationObserver(() => {
		accent = cssRgb('--accent');
		slate = cssRgb('--accent-slate');
		instances.forEach((inst) => syncColors(inst, accent, slate));
	});
	theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

	document.addEventListener('visibilitychange', syncPlayback);

	if (followMouse) {
		window.addEventListener(
			'pointermove',
			(event) => {
				pointer.x = event.clientX;
				pointer.y = event.clientY;
				pointer.seen = true;
				syncPlayback();
			},
			{ passive: true },
		);
	}

	syncPlayback();
}
