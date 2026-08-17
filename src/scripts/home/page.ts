import { initCursor, initHeroParallax } from './cursor';

const REVEAL_SEL = '.fade-up, .fade-in, .perspective-load, .scale-in, .line-draw';

function revealNow(el: Element) {
	el.classList.add('is-revealed');
}

function revealAll() {
	document.querySelectorAll(REVEAL_SEL).forEach(revealNow);
}

function heroIntro() {
	const hero = document.querySelector('.hero');
	if (!hero) return;

	function mark(el: Element, delay: number) {
		el.setAttribute('data-hero-animated', 'true');
		setTimeout(() => {
			revealNow(el);
		}, delay);
	}

	const names = hero.querySelectorAll('.perspective-load');
	const copy = hero.querySelectorAll('.hero-intro .fade-up, .hero-actions');

	names.forEach((el, i) => {
		mark(el, 400 + i * 200);
	});
	copy.forEach((el, i) => {
		mark(el, 800 + i * 150);
	});
}

function triggerFor(el: Element): Element {
	if (el.classList.contains('perspective-load')) {
		if (el.parentElement?.classList.contains('perspective')) {
			return el.parentElement;
		}
		return el.closest('.section-head-title, .hero-name, .close-title') || el;
	}
	return el;
}

function groupFor(el: Element): Element[] {
	const parent = el.parentElement?.closest(
		'.hero-name, .close-title, .section-head-title, .work-list, .faq-list, .grid, .stack.tight',
	);
	if (!parent) return [el];
	const group = Array.from(parent.querySelectorAll(REVEAL_SEL)).filter(
		(node) => !node.getAttribute('data-hero-animated'),
	);
	return group.includes(el) ? group : [el];
}

function scrollReveal() {
	const animated = Array.from(document.querySelectorAll(REVEAL_SEL)).filter(
		(el) => !el.getAttribute('data-hero-animated'),
	);
	if (!animated.length) return;

	if (typeof IntersectionObserver === 'undefined') {
		animated.forEach(revealNow);
		return;
	}

	const easeThreshold = window.matchMedia('(max-width: 767px)').matches
		? { rootMargin: '0px 0px -4% 0px' }
		: { rootMargin: '0px 0px -10% 0px' };

	const pending = new Set(animated);
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				let starter: Element | null = null;
				pending.forEach((el) => {
					if (!starter && triggerFor(el) === entry.target) starter = el;
				});
				if (!starter) {
					io.unobserve(entry.target);
					return;
				}
				revealGroup(starter);
			});
		},
		{ threshold: 0, rootMargin: easeThreshold.rootMargin },
	);

	function revealGroup(starter: Element) {
		let delay = 0;
		groupFor(starter).forEach((el) => {
			if (!pending.has(el)) return;
			pending.delete(el);
			const wait = delay;
			delay += el.classList.contains('perspective-load') ? 200 : 90;
			setTimeout(() => {
				revealNow(el);
			}, Math.min(wait, 800));
			io.unobserve(triggerFor(el));
		});
	}

	animated.forEach((el) => {
		io.observe(triggerFor(el));
	});

	function flushVisible() {
		const ready: Element[] = [];
		pending.forEach((el) => {
			const box = triggerFor(el).getBoundingClientRect();
			const vh = window.innerHeight || document.documentElement.clientHeight;
			if (box.width < 1 || box.height < 1) return;
			if (box.bottom > 0 && box.top < vh) ready.push(el);
		});
		ready.forEach((el) => {
			if (pending.has(el)) revealGroup(el);
		});
	}

	requestAnimationFrame(() => {
		requestAnimationFrame(flushVisible);
	});
	window.addEventListener('load', flushVisible);
}

function navAutoHide() {
	const nav = document.querySelector('.navbar');
	if (!nav) return;

	let last = window.scrollY;
	let ticking = false;

	window.addEventListener(
		'scroll',
		() => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				const y = window.scrollY;
				if (y < 64) nav.classList.remove('is-away');
				else if (y > last + 8) nav.classList.add('is-away');
				else if (y < last - 8) nav.classList.remove('is-away');
				last = y;
				ticking = false;
			});
		},
		{ passive: true },
	);

	nav.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener('click', () => {
			nav.classList.remove('is-away');
		});
	});
}

function marqueePause() {
	const marquee = document.querySelector('.marquee');
	if (!marquee || typeof IntersectionObserver === 'undefined') return;

	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				marquee.classList.toggle('is-paused', !entry.isIntersecting);
			});
		},
		{ rootMargin: '15% 0px' },
	);

	io.observe(marquee);
}

function accordion() {
	document.querySelectorAll('.service-row').forEach((row) => {
		row.addEventListener('click', () => {
			const item = row.closest('.service-item');
			if (!item) return;
			const open = item.classList.contains('is-open');
			item.parentElement?.querySelectorAll('.service-item').forEach((sibling) => {
				sibling.classList.remove('is-open');
				const control = sibling.querySelector('.service-row');
				if (control) control.setAttribute('aria-expanded', 'false');
				const state = sibling.querySelector('.service-state');
				if (state) state.textContent = '( Ver )';
			});
			if (open) return;
			item.classList.add('is-open');
			row.setAttribute('aria-expanded', 'true');
			const state = item.querySelector('.service-state');
			if (state) state.textContent = '( Fechar )';
		});
	});
}

function copyTokens() {
	document.querySelectorAll('[data-copy]').forEach((el) => {
		el.addEventListener('click', () => {
			const value = el.getAttribute('data-copy');
			if (!value || !navigator.clipboard) return;
			navigator.clipboard.writeText(value).then(() => {
				const label = el.querySelector('.spec-value');
				if (!label) return;
				const original = label.textContent;
				label.textContent = 'copiado';
				setTimeout(() => {
					label.textContent = original;
				}, 1200);
			});
		});
	});
}

function dismissBanner() {
	const banner = document.querySelector('.wrapper-sticky-button');
	const close = document.querySelector('.wrapper-close');
	if (!banner || !close) return;
	close.addEventListener('click', () => {
		banner.remove();
	});
}

function navCurrent() {
	const nav = document.querySelector('.nav-menu');
	if (!nav) return;
	const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a.nav-link[href^="#"]'));
	const items = links
		.map((link) => {
			const id = link.getAttribute('href')?.slice(1);
			const el = id ? document.getElementById(id) : null;
			return el ? { link, el } : null;
		})
		.filter((item): item is { link: HTMLAnchorElement; el: HTMLElement } => item !== null);
	if (!items.length) return;

	function setCurrent(active: HTMLAnchorElement) {
		items.forEach((item) => {
			if (item.link === active) item.link.setAttribute('aria-current', 'true');
			else item.link.removeAttribute('aria-current');
		});
	}

	links.forEach((link) => {
		link.addEventListener('click', () => {
			setCurrent(link);
		});
	});

	if (typeof IntersectionObserver === 'undefined') return;

	const io = new IntersectionObserver(
		(entries) => {
			const visible = entries
				.filter((entry) => entry.isIntersecting)
				.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
			if (!visible) return;
			const match = items.find((item) => item.el === visible.target);
			if (match) setCurrent(match.link);
		},
		{ rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.2, 0.5] },
	);

	items.forEach((item) => {
		io.observe(item.el);
	});
}

export function initHome(): void {
	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (reduced) {
		revealAll();
	} else {
		heroIntro();
		scrollReveal();
		initHeroParallax();
		navAutoHide();
		marqueePause();
		initCursor();
	}

	accordion();
	copyTokens();
	dismissBanner();
	navCurrent();
}
