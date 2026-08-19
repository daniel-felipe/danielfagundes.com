const MOBILE_NAV = '(max-width: 991px)';
const FOCUSABLE = 'a[href], button:not([disabled])';

export function initNavMenu(): void {
	const nav = document.querySelector<HTMLElement>('.navbar');
	const menu = document.querySelector<HTMLElement>('#nav-menu');
	const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
	if (!nav || !menu || !toggle) return;

	const mq = window.matchMedia(MOBILE_NAV);

	function isMobile(): boolean {
		return mq.matches;
	}

	function isOpen(): boolean {
		return nav.classList.contains('is-open');
	}

	function label(open: boolean): string {
		return toggle.getAttribute(open ? 'data-label-close' : 'data-label-open') ?? '';
	}

	function syncClosedChrome(): void {
		toggle.setAttribute('aria-expanded', 'false');
		toggle.setAttribute('aria-label', label(false));
		if (isMobile()) {
			menu.setAttribute('aria-hidden', 'true');
			menu.inert = true;
		} else {
			menu.removeAttribute('aria-hidden');
			menu.inert = false;
		}
		document.documentElement.classList.remove('nav-open');
	}

	function open(): void {
		if (!isMobile() || isOpen()) return;
		nav.classList.remove('is-away');
		nav.classList.add('is-open');
		toggle.setAttribute('aria-expanded', 'true');
		toggle.setAttribute('aria-label', label(true));
		menu.setAttribute('aria-hidden', 'false');
		menu.inert = false;
		document.documentElement.classList.add('nav-open');
	}

	function close(opts?: { restoreFocus?: boolean }): void {
		const wasOpen = isOpen();
		nav.classList.remove('is-open');
		syncClosedChrome();
		if (wasOpen && opts?.restoreFocus !== false && isMobile()) toggle.focus();
	}

	function focusables(): HTMLElement[] {
		return Array.from(nav.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => {
			if (el.closest('[inert]')) return false;
			return el.getClientRects().length > 0;
		});
	}

	toggle.addEventListener('click', () => {
		if (isOpen()) close();
		else open();
	});

	menu.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener('click', () => close({ restoreFocus: false }));
	});

	nav.querySelector('.brand')?.addEventListener('click', () => close({ restoreFocus: false }));

	document.addEventListener('keydown', (event) => {
		if (!isOpen()) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			close();
			return;
		}

		if (event.key !== 'Tab') return;

		const items = focusables();
		if (items.length < 2) return;

		const first = items[0];
		const last = items[items.length - 1];
		if (!first || !last) return;
		const active = document.activeElement;

		if (event.shiftKey && active === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && active === last) {
			event.preventDefault();
			first.focus();
		}
	});

	mq.addEventListener('change', () => {
		if (!isMobile()) close();
		else syncClosedChrome();
	});

	syncClosedChrome();
}
