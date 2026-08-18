import gsap from 'gsap';

export function initCursor(): void {
	const wrap = document.querySelector('.wrapper-cursor');
	if (!wrap) return;
	if (window.matchMedia('(pointer: coarse)').matches) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	document.body.classList.add('has-cursor');

	const blockCursor = wrap.querySelector<HTMLElement>('.block-cursor');
	const lineCursorX = wrap.querySelectorAll<HTMLElement>('.line-cursor.v1');
	const lineCursorY = wrap.querySelectorAll<HTMLElement>('.line-cursor.v2');
	const bigCircle = wrap.querySelector<HTMLElement>('.cursor-big-circle');
	const smallCircle = wrap.querySelector<HTMLElement>('.cursor-small-circle');
	const arrow = wrap.querySelector<HTMLElement>('.cursor-arrow');
	const ease = 'power2.out';
	const dur = 0.4;
	const LINK_DISC = 48 / 22;

	if (blockCursor) gsap.set(blockCursor, { xPercent: -50, yPercent: -50 });
	gsap.set([bigCircle, smallCircle, arrow].filter(Boolean), { xPercent: -50, yPercent: -50 });
	if (arrow) gsap.set(arrow, { opacity: 0, scale: 0.2 });

	const blockX = blockCursor ? gsap.quickTo(blockCursor, 'x', { duration: 0.4, ease: 'power3.out' }) : null;
	const blockY = blockCursor ? gsap.quickTo(blockCursor, 'y', { duration: 0.4, ease: 'power3.out' }) : null;
	const lineXTo = lineCursorX.length ? gsap.quickTo(lineCursorX, 'x', { duration: 0.4, ease: 'power3.out' }) : null;
	const lineYTo = lineCursorY.length ? gsap.quickTo(lineCursorY, 'y', { duration: 0.4, ease: 'power3.out' }) : null;

	window.addEventListener('mousemove', (e) => {
		if (blockX) blockX(e.clientX);
		if (blockY) blockY(e.clientY);
		if (lineXTo) lineXTo(e.clientX);
		if (lineYTo) lineYTo(e.clientY);
	});

	function rest() {
		if (bigCircle) gsap.to(bigCircle, { opacity: 1, scale: 1, duration: dur, ease, overwrite: 'auto' });
		if (smallCircle) gsap.to(smallCircle, { scale: 1, duration: dur, ease, overwrite: 'auto' });
		if (arrow) gsap.to(arrow, { opacity: 0, scale: 0.2, duration: dur, ease, overwrite: 'auto' });
	}

	function showArrow() {
		if (bigCircle) gsap.to(bigCircle, { opacity: 0, scale: 1, duration: dur, ease, overwrite: 'auto' });
		if (smallCircle) gsap.to(smallCircle, { scale: LINK_DISC, duration: dur, ease, overwrite: 'auto' });
		if (arrow) gsap.to(arrow, { opacity: 1, scale: 1, duration: dur, ease, overwrite: 'auto' });
	}

	function swell() {
		if (bigCircle) gsap.to(bigCircle, { scale: 1.9, opacity: 0.35, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
		if (smallCircle) gsap.to(smallCircle, { scale: 1, duration: dur, ease, overwrite: 'auto' });
		if (arrow) gsap.to(arrow, { opacity: 0, scale: 0.2, duration: dur, ease, overwrite: 'auto' });
	}

	const targets = 'a, button, .project-item, .service-row, .work-item, .swatch-chip';
	document.querySelectorAll<HTMLElement>(targets).forEach((el) => {
		el.addEventListener('mouseenter', () => {
			if (el.matches('a, .brand, .project-item, .work-item')) showArrow();
			else swell();
		});
		el.addEventListener('mouseleave', rest);
	});
}

export function initHeroParallax(): void {
	if (window.matchMedia('(max-width: 991px)').matches) return;
	if (window.matchMedia('(pointer: coarse)').matches) return;

	const hero = document.querySelector('.hero');
	const lines = document.querySelectorAll<HTMLElement>('.hero-name .perspective');
	if (!hero || lines.length < 2) return;

	const x0 = gsap.quickTo(lines[0], 'x', { duration: 0.7, ease: 'power3.out' });
	const x1 = gsap.quickTo(lines[1], 'x', { duration: 0.7, ease: 'power3.out' });

	function update() {
		const rect = hero.getBoundingClientRect();
		const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
		const span = Math.min(window.innerWidth * 0.08, 96);
		x0(progress * span);
		x1(progress * -span * 1.35);
	}

	window.addEventListener('scroll', update, { passive: true });
	update();
}
