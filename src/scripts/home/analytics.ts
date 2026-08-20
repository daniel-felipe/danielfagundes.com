declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
	}
}

type TrackParams = Record<string, string>;

export function trackEvent(name: string, params?: TrackParams): void {
	if (typeof window.gtag !== 'function') return;
	window.gtag('event', name, params);
}

function trackFromElement(el: Element): void {
	const name = el.getAttribute('data-track');
	if (!name) return;

	const location = el.getAttribute('data-track-location');
	trackEvent(name, location ? { location } : undefined);
}

export function initAnalytics(): void {
	document.addEventListener('click', (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const el = target.closest('[data-track]');
		if (!el || el instanceof HTMLFormElement) return;
		trackFromElement(el);
	});

	document.querySelectorAll<HTMLFormElement>('form[data-track]').forEach((form) => {
		form.addEventListener('submit', () => {
			trackFromElement(form);
		});
	});
}
