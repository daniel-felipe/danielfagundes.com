import type { HomeCopy } from '../home';

export const en: HomeCopy = {
	htmlLang: 'en',
	email: 'contato@danielfagundes.com',
	github: 'https://github.com/daniel-felipe',
	meta: {
		title: 'Daniel Fagundes | Full-Stack Developer',
		description:
			'Full-stack developer in São João del Rei: web systems, sites, and automations with Laravel, React, and n8n. I take on projects beyond DevStats.',
		jobTitle: 'Full-Stack Developer',
		ogImageAlt: 'Daniel Fagundes, full-stack developer',
	},
	nav: {
		skipToContent: 'Skip to content',
		brandAria: 'Daniel Fagundes, home',
		menuAria: 'Main navigation',
		menuOpen: 'Open menu',
		menuClose: 'Close menu',
		themeToggle: 'Toggle theme',
		langAria: 'Language',
		links: [
			{ href: '#projetos', label: 'Projects' },
			{ href: '#servicos', label: 'Services' },
			{ href: '#contato', label: 'Contact' },
		],
	},
	hero: {
		firstName: 'Daniel',
		lastName: 'Fagundes',
		p1: "Hi, I'm Daniel. I'm a full-stack developer and software engineer at DevStats. Day to day, I build web systems with Laravel and React.",
		p2: 'Outside of work, I take on my own projects and explore topics that catch my curiosity — data, AI, and cybersecurity — using tools like Python.',
		workLink: "Take a look at what I've built.",
		contactCta: 'Get in touch',
		githubCta: 'GitHub',
	},
	marquee: [
		{ label: 'Build.' },
		{ label: 'Integrate.', outline: true },
		{ label: 'Automate.' },
		{ label: 'Analyze.', outline: true },
	],
	projects: {
		title: 'Recent work',
		items: [
			{
				title: 'Camarão Prime',
				href: 'https://www.camaraoprime.com/',
				tag: 'E-commerce',
				lead: 'Product catalog, cart, user accounts, and checkout for a fish market with delivery in Santa Cruz de Minas.',
			},
			{
				title: 'Petbull Veterinary Clinic',
				href: 'https://petbull.netlify.app',
				tag: 'Institutional site',
				lead: 'Service overview and scheduling for a veterinary clinic in São João del Rei.',
			},
			{
				title: 'CS Barber',
				href: 'https://csbarber.com.br',
				tag: 'Institutional site',
				lead: 'Service overview and booking (via app + WhatsApp) for a barbershop in São João del Rei.',
			},
		],
	},
	services: {
		title: 'Services',
		lead: 'What I do, in practice:',
		view: '( View )',
		close: '( Close )',
		items: [
			{
				title: 'Web applications',
				body: 'Full-stack systems and platforms, with attention to performance and how the product will grow.',
				tags: ['Front-end', 'Back-end', 'Performance'],
				open: true,
			},
			{
				title: 'API integration',
				body: 'Connecting your system to external services: payments, third-party platforms, AI models.',
				tags: ['Payments', 'Third parties', 'AI models'],
			},
			{
				title: 'System maintenance',
				body: 'Bug fixes, new features, and code cleanup on systems already in production.',
				tags: ['Production', 'Bugs', 'Features'],
			},
			{
				title: 'Databases',
				body: 'Modeling, query optimization, and data structure designed for scale.',
				tags: ['Modeling', 'Queries', 'Scale'],
			},
			{
				title: 'n8n automations',
				body: 'n8n flows that connect tools, APIs, and notifications, cutting manual work while keeping the process visible.',
				tags: ['n8n', 'APIs', 'Flows'],
			},
			{
				title: 'Data analysis',
				body: 'Organizing and reading data to answer concrete questions: what is happening, where the bottleneck is, and what is worth tracking.',
				tags: ['Organization', 'Reading', 'Tracking'],
			},
		],
	},
	tools: {
		title: 'Tools I use',
		groups: [
			{ label: 'Back-end', tags: ['PHP', 'Laravel'] },
			{ label: 'Front-end', tags: ['React', 'Livewire', 'Tailwind'] },
			{
				label: 'Data & AI',
				tags: ['Python', 'Pandas', 'SQL / PostgreSQL', 'Jupyter', 'Streamlit', 'Claude'],
			},
		],
	},
	faq: {
		title: 'FAQ',
		items: [
			{
				question: 'Do you take on projects outside your work at DevStats?',
				answer:
					'Yes. I stay at DevStats and, in parallel, take on my own projects, with a schedule that does not compete with the day job. If it is a fit, I reply with a diagnosis and a next step.',
			},
			{
				question: 'What kind of projects do you take?',
				answer:
					'Landing pages and institutional sites, web systems (such as the Camarão Prime e-commerce), data analysis, and n8n automations. I also maintain and integrate APIs on systems already in production.',
			},
			{
				question: 'How does pricing work?',
				answer:
					'After I understand what you need, I send a fixed quote — no surprises along the way. Start with a message: describe the project and I will come back with scope, timeline, and price.',
			},
			{
				question: 'Do you work remotely, or only in São João del Rei?',
				answer:
					'I work remotely and also on projects in the São João del Rei and Santa Cruz de Minas area, where work like Petbull and CS Barber comes from. The format depends on what the project needs.',
			},
		],
	},
	contact: {
		eyebrow: 'Have an idea?',
		title: "Let's build",
		titleSoft: 'this together.',
		lead: "Tell me what you need. I'll reply with an honest diagnosis, including if the answer is that you don't need a developer.",
		cta: 'Send a message',
		form: {
			nameLabel: 'Name',
			namePlaceholder: 'Your full name',
			emailLabel: 'Email',
			emailPlaceholder: 'you@domain.com',
			messageLabel: 'Message',
			messagePlaceholder: 'Tell me a bit about the project',
		},
		name: 'Daniel Fagundes',
		backToTop: 'Back to top',
		channelsAria: 'Channels',
		copied: 'copied',
		channels: [
			{
				label: 'LinkedIn',
				href: 'https://www.linkedin.com/in/daniel-felipe-fagundes',
				external: true,
			},
			{ label: 'GitHub', href: 'https://github.com/daniel-felipe', external: true },
			{
				label: 'Instagram',
				href: 'https://www.instagram.com/danielfagundes.dev',
				external: true,
			},
			{ label: 'Email', href: 'mailto:contato@danielfagundes.com' },
		],
	},
};
