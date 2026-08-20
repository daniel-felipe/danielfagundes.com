import { trackEvent } from './analytics';

const CONTACT_ENDPOINT = import.meta.env.PUBLIC_CONTACT_ENDPOINT;
const CONTACT_TOKEN = import.meta.env.PUBLIC_CONTACT_TOKEN;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ScriptSuccess = { result: 'success'; message: string };
type ScriptError = { result: 'error'; error: string };
type ScriptResult = ScriptSuccess | ScriptError;

/*
  CORS: Apps Script Web Apps do not answer OPTIONS preflights. A
  `Content-Type: application/json` POST is a "non-simple" request, so the
  browser preflights it and `fetch()` never reaches `doPost`. Sending the
  same JSON string as `text/plain` keeps the request simple (no preflight).
  Apps Script still reads `e.postData.contents`, and the JSON body of the
  200 response is readable — so success/error copy from the backend can
  be shown as-is. `no-cors` / hidden-iframe fallbacks were not used: they
  would hide those messages.
*/
function isScriptResult(value: unknown): value is ScriptResult {
	if (!value || typeof value !== 'object') return false;
	const rec = value as Record<string, unknown>;
	if (rec.result === 'success') return typeof rec.message === 'string';
	if (rec.result === 'error') return typeof rec.error === 'string';
	return false;
}

type FieldEl = HTMLInputElement | HTMLTextAreaElement;

function fieldError(input: FieldEl): HTMLElement | null {
	const id = input.getAttribute('aria-describedby');
	return id ? document.getElementById(id) : null;
}

function setFieldError(input: FieldEl, message: string) {
	input.classList.add('is-invalid');
	input.setAttribute('aria-invalid', 'true');
	const error = fieldError(input);
	if (!error) return;
	error.hidden = false;
	error.textContent = message;
}

function clearFieldError(input: FieldEl) {
	input.classList.remove('is-invalid');
	input.removeAttribute('aria-invalid');
	const error = fieldError(input);
	if (!error) return;
	error.hidden = true;
	error.textContent = '';
}

function showStatus(el: HTMLElement, message: string, kind: 'success' | 'error') {
	el.hidden = false;
	el.dataset.kind = kind;
	el.textContent = message;
}

function hideStatus(el: HTMLElement) {
	el.hidden = true;
	el.removeAttribute('data-kind');
	el.textContent = '';
}

function bindForm(form: HTMLFormElement) {
	const nameInput = form.querySelector<HTMLInputElement>('#contact-name');
	const emailInput = form.querySelector<HTMLInputElement>('#contact-email');
	const messageInput = form.querySelector<HTMLTextAreaElement>('#contact-message');
	const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
	const submitLabel = submit?.querySelector('.button-label');
	const status = form.querySelector<HTMLElement>('[data-contact-status]');
	if (!nameInput || !emailInput || !messageInput || !submit || !submitLabel || !status) return;

	const submitBtn = submit;
	const labelEl = submitLabel;
	const idleLabel = labelEl.textContent ?? '';
	const sendingLabel = form.getAttribute('data-label-sending') ?? idleLabel;
	const lang = form.getAttribute('data-lang') || document.documentElement.lang || 'pt-BR';

	function setSending(sending: boolean) {
		form.classList.toggle('is-sending', sending);
		form.setAttribute('aria-busy', sending ? 'true' : 'false');
		submitBtn.disabled = sending;
		labelEl.textContent = sending ? sendingLabel : idleLabel;
	}

	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		if (submit.disabled) return;

		clearFieldError(nameInput);
		clearFieldError(emailInput);
		clearFieldError(messageInput);
		hideStatus(status);

		const nome = nameInput.value.trim();
		const email = emailInput.value.trim();
		const mensagem = messageInput.value.trim();

		let firstInvalid: FieldEl | null = null;
		if (!nome) {
			setFieldError(nameInput, form.getAttribute('data-msg-name-required') ?? '');
			firstInvalid = nameInput;
		}
		if (email && !EMAIL_RE.test(email)) {
			setFieldError(emailInput, form.getAttribute('data-msg-email-invalid') ?? '');
			firstInvalid ??= emailInput;
		}
		if (!mensagem) {
			setFieldError(messageInput, form.getAttribute('data-msg-message-required') ?? '');
			firstInvalid ??= messageInput;
		}
		if (firstInvalid) {
			firstInvalid.focus();
			return;
		}

		if (!CONTACT_ENDPOINT || !CONTACT_TOKEN) {
			showStatus(status, form.getAttribute('data-msg-network') ?? '', 'error');
			return;
		}

		const payload: Record<string, string> = { nome, mensagem, lang, token: CONTACT_TOKEN };
		if (email) payload.email = email;

		setSending(true);
		try {
			const response = await fetch(CONTACT_ENDPOINT, {
				method: 'POST',
				redirect: 'follow',
				headers: { 'Content-Type': 'text/plain;charset=utf-8' },
				body: JSON.stringify(payload),
			});

			let data: unknown;
			try {
				data = await response.json();
			} catch {
				throw new Error('unreadable');
			}

			if (!isScriptResult(data)) throw new Error('unreadable');

			if (data.result === 'success') {
				form.reset();
				showStatus(status, data.message, 'success');
				trackEvent('contact_submit');
			} else {
				showStatus(status, data.error, 'error');
			}
		} catch {
			showStatus(status, form.getAttribute('data-msg-network') ?? '', 'error');
		} finally {
			setSending(false);
		}
	});
}

export function initContactForm(): void {
	document.querySelectorAll<HTMLFormElement>('[data-contact-form]').forEach(bindForm);
}
