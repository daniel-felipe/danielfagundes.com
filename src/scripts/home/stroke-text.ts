import gsap from 'gsap';

const SVG_NS = 'http://www.w3.org/2000/svg';
const DRAW_DURATION = 1.6;
const FILL_DELAY = 0.2;
const STAGGER = 0.05;
const EASE = 'power2.out';

let wipeSeq = 0;

function svgEl(name: string, attrs: Record<string, string> = {}): SVGElement {
	const node = document.createElementNS(SVG_NS, name);
	for (const [key, value] of Object.entries(attrs)) {
		node.setAttribute(key, value);
	}
	return node;
}

function charsOf(text: string): string[] {
	return Array.from(text);
}

function fillTspans(
	textEl: SVGTextElement,
	chars: string[],
	attr: string,
	dash?: string,
): SVGTSpanElement[] {
	const spans: SVGTSpanElement[] = [];
	chars.forEach((char) => {
		const attrs: Record<string, string> = { [attr]: '' };
		if (dash) {
			attrs['stroke-dasharray'] = dash;
			attrs['stroke-dashoffset'] = dash;
		}
		const tspan = svgEl('tspan', attrs) as SVGTSpanElement;
		tspan.textContent = char;
		textEl.append(tspan);
		spans.push(tspan);
	});
	return spans;
}

function measureBox(strokeText: SVGTextElement, strokeWidth: number) {
	let bbox: DOMRect;
	try {
		bbox = strokeText.getBBox();
	} catch {
		return null;
	}
	if (!bbox.width) return null;
	const pad = strokeWidth;
	return {
		x: 0,
		y: bbox.y - pad,
		width: Math.max(bbox.x + bbox.width, bbox.width) + pad,
		height: bbox.height + pad * 2,
	};
}

type Box = { x: number; y: number; width: number; height: number };

function sameBox(a: Box | null, b: Box): boolean {
	return Boolean(
		a &&
			Math.abs(a.x - b.x) < 0.5 &&
			Math.abs(a.y - b.y) < 0.5 &&
			Math.abs(a.width - b.width) < 0.5 &&
			Math.abs(a.height - b.height) < 0.5,
	);
}

function applyBox(svg: SVGSVGElement, wipe: SVGRectElement, box: Box) {
	svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`);
	svg.setAttribute('width', String(box.width));
	svg.setAttribute('height', String(box.height));
	wipe.setAttribute('x', String(box.x));
	wipe.setAttribute('y', String(box.y));
	wipe.setAttribute('height', String(box.height));
}

function mount(root: HTMLElement) {
	const label = root.querySelector<HTMLElement>('.stroke-text__label');
	const text = (label?.textContent ?? root.textContent ?? '').replace(/\s+/g, ' ').trim();
	if (!text) return;

	const chars = charsOf(text);
	const wipeId = `stroke-text-wipe-${++wipeSeq}`;
	const fontSize = parseFloat(getComputedStyle(root).fontSize) || 48;
	const strokeWidth = Math.max(1.2, fontSize * 0.012);
	const dash = String(Math.max(fontSize * 7, 200));

	const svg = svgEl('svg', {
		class: 'stroke-text__svg',
		role: 'presentation',
		'aria-hidden': 'true',
		focusable: 'false',
		preserveAspectRatio: 'xMinYMid meet',
	}) as SVGSVGElement;

	const defs = svgEl('defs');
	const clip = svgEl('clipPath', { id: wipeId, clipPathUnits: 'userSpaceOnUse' });
	const wipe = svgEl('rect', { x: '0', y: '0', width: '0', height: '0' }) as SVGRectElement;
	clip.append(wipe);
	defs.append(clip);

	const strokeText = svgEl('text', {
		class: 'stroke-text__stroke',
		x: '0',
		y: '0',
		fill: 'none',
		'stroke-width': String(strokeWidth),
		'stroke-linejoin': 'round',
		'stroke-linecap': 'round',
	}) as SVGTextElement;
	const strokes = fillTspans(strokeText, chars, 'data-stroke-char', dash);

	const fillText = svgEl('text', {
		class: 'stroke-text__fill',
		x: '0',
		y: '0',
		'clip-path': `url(#${wipeId})`,
	}) as SVGTextElement;
	const fills = fillTspans(fillText, chars, 'data-fill-char');

	svg.append(defs, strokeText, fillText);
	root.append(svg);

	let box: Box | null = null;
	let timeline: ReturnType<typeof gsap.timeline> | null = null;
	let played = false;

	const targets = [...strokes, ...fills, wipe];

	const setStart = () => {
		gsap.killTweensOf(targets);
		gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
		gsap.set(fills, { opacity: 1 });
		gsap.set(wipe, { attr: { width: 0 } });
	};

	const setEnd = () => {
		gsap.killTweensOf(targets);
		gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });
		gsap.set(fills, { opacity: 1 });
		if (box) gsap.set(wipe, { attr: { width: box.width } });
	};

	const play = () => {
		if (played || !box) return;
		played = true;
		setStart();
		timeline?.kill();
		timeline = gsap.timeline({ defaults: { overwrite: 'auto' } });
		timeline.to(strokes, { strokeDashoffset: 0, duration: DRAW_DURATION, ease: EASE, stagger: STAGGER }, 0);
		timeline.to(
			wipe,
			{ attr: { width: box.width }, duration: Math.max(0.4, DRAW_DURATION * 0.5), ease: 'power2.inOut' },
			DRAW_DURATION + FILL_DELAY,
		);
	};

	const layout = () => {
		const next = measureBox(strokeText, strokeWidth);
		if (!next) return false;
		if (sameBox(box, next)) return true;
		box = next;
		applyBox(svg, wipe, next);
		if (played) setEnd();
		else setStart();
		return true;
	};

	const ready = () => {
		if (!layout()) return;
		root.classList.add('is-ready');
		if (typeof IntersectionObserver === 'undefined') {
			play();
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				play();
				io.disconnect();
			},
			{ threshold: 0, rootMargin: '0px 0px -18% 0px' },
		);
		io.observe(root);
		requestAnimationFrame(() => {
			const rect = root.getBoundingClientRect();
			const vh = window.innerHeight || document.documentElement.clientHeight;
			if (rect.bottom > 0 && rect.top < vh * 0.82) play();
		});
	};

	let tries = 0;
	const start = () => {
		if (!layout()) {
			tries += 1;
			if (tries < 60) requestAnimationFrame(start);
			else root.classList.add('stroke-text--static');
			return;
		}
		ready();
	};

	if (document.fonts?.ready) {
		document.fonts.ready.then(start).catch(start);
	} else {
		start();
	}

	const ro = new ResizeObserver(() => {
		if (!root.classList.contains('is-ready')) return;
		layout();
	});
	ro.observe(root);
}

export function initStrokeText(): void {
	const roots = document.querySelectorAll<HTMLElement>('[data-stroke-text]');
	if (!roots.length) return;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		roots.forEach((root) => {
			root.classList.add('stroke-text--static');
		});
		return;
	}

	roots.forEach(mount);
}
