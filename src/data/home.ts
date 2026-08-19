import { en } from './locales/en';
import { ptBr } from './locales/pt-br';

export type Locale = 'pt-br' | 'en';

export interface NavLink {
	href: string;
	label: string;
	optional?: boolean;
}

export interface MarqueeItem {
	label: string;
	outline?: boolean;
}

export interface Project {
	title: string;
	href: string;
	tag: string;
	lead: string;
}

export interface Service {
	title: string;
	body: string;
	tags: string[];
	open?: boolean;
}

export interface ToolGroup {
	label: string;
	tags: string[];
}

export interface FaqItem {
	question: string;
	answer: string;
}

export interface Channel {
	label: string;
	href: string;
	external?: boolean;
}

export interface HomeCopy {
	htmlLang: string;
	email: string;
	github: string;
	meta: {
		title: string;
		description: string;
	};
	nav: {
		skipToContent: string;
		brandAria: string;
		menuAria: string;
		themeToggle: string;
		langAria: string;
		links: NavLink[];
	};
	hero: {
		firstName: string;
		lastName: string;
		p1: string;
		p2: string;
		workLink: string;
		contactCta: string;
		githubCta: string;
	};
	marquee: MarqueeItem[];
	projects: {
		title: string;
		items: Project[];
	};
	services: {
		title: string;
		lead: string;
		view: string;
		close: string;
		items: Service[];
	};
	tools: {
		title: string;
		groups: ToolGroup[];
	};
	faq: {
		title: string;
		items: FaqItem[];
	};
	contact: {
		eyebrow: string;
		title: string;
		titleSoft: string;
		lead: string;
		cta: string;
		name: string;
		backToTop: string;
		channelsAria: string;
		copied: string;
		channels: Channel[];
	};
}

const catalog: Record<Locale, HomeCopy> = {
	'pt-br': ptBr,
	en,
};

export function getHome(locale: Locale): HomeCopy {
	return catalog[locale];
}

function padIndex(index: number): string {
	return String(index + 1).padStart(2, '0');
}

export function sectionIndex(index: number): string {
	return padIndex(index);
}
