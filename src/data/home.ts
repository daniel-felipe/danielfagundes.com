export const site = {
	title: 'Daniel Fagundes | Full-Stack Developer',
	description:
		'Daniel Fagundes, desenvolvedor Full-Stack e engenheiro de software na DevStats. Sistemas web com Laravel, React, Python e IA aplicada.',
	email: 'contato@danielfagundes.com',
	github: 'https://github.com/daniel-felipe',
} as const;

export interface NavLink {
	href: string;
	label: string;
	optional?: boolean;
}

export const navLinks: NavLink[] = [
	{ href: '#projetos', label: 'Projetos' },
	{ href: '#servicos', label: 'Serviços', optional: true },
	{ href: '#contato', label: 'Contato' },
];

export interface MarqueeItem {
	label: string;
	outline?: boolean;
}

export const marqueeItems: MarqueeItem[] = [
	{ label: 'Construir.' },
	{ label: 'Integrar.', outline: true },
	{ label: 'Automatizar.' },
	{ label: 'Analisar.', outline: true },
];

export interface Project {
	title: string;
	href: string;
	tag: string;
	lead: string;
}

export const projects: Project[] = [
	{
		title: 'Camarão Prime',
		href: 'https://www.camaraoprime.com/',
		tag: 'E-commerce',
		lead: 'Catálogo de produtos, carrinho, conta de usuário e checkout para uma peixaria com entrega em Santa Cruz de Minas.',
	},
	{
		title: 'Petbull Clínica Veterinária',
		href: 'https://petbull.netlify.app',
		tag: 'Site institucional',
		lead: 'Apresentação de serviços e agendamento para uma clínica veterinária em São João del Rei.',
	},
	{
		title: 'CS Barber',
		href: 'https://csbarber.com.br',
		tag: 'Site institucional',
		lead: 'Apresentação de serviços e agendamento (via app + WhatsApp) para uma barbearia em São João del Rei.',
	},
];

export interface Service {
	title: string;
	body: string;
	tags: string[];
	open?: boolean;
}

export const services: Service[] = [
	{
		title: 'Aplicações Web',
		body: 'Desenvolvimento completo de sistemas e plataformas, front-end e back-end, com atenção a performance e a como o sistema vai crescer.',
		tags: ['Front-end', 'Back-end', 'Performance'],
		open: true,
	},
	{
		title: 'Integração de APIs',
		body: 'Conexão entre o seu sistema e serviços externos: pagamentos, plataformas de terceiros, modelos de IA.',
		tags: ['Pagamentos', 'Terceiros', 'Modelos de IA'],
	},
	{
		title: 'Manutenção de sistemas',
		body: 'Correção de bugs, novas funcionalidades e organização de código em sistemas já em produção.',
		tags: ['Produção', 'Bugs', 'Funcionalidades'],
	},
	{
		title: 'Banco de dados',
		body: 'Modelagem, otimização de consultas e estruturação de dados pensando em escala.',
		tags: ['Modelagem', 'Consultas', 'Escala'],
	},
	{
		title: 'Criação de automações com n8n',
		body: 'Fluxos no n8n que conectam ferramentas, APIs e notificações, reduzindo trabalho manual e mantendo o processo visível.',
		tags: ['n8n', 'APIs', 'Fluxos'],
	},
	{
		title: 'Análise de dados',
		body: 'Organização e leitura de dados para responder perguntas concretas: o que está acontecendo, onde está o gargalo e o que vale acompanhar.',
		tags: ['Organização', 'Leitura', 'Acompanhamento'],
	},
];

export interface ToolGroup {
	label: string;
	tags: string[];
}

export const toolGroups: ToolGroup[] = [
	{ label: 'Back-end', tags: ['PHP', 'Laravel'] },
	{ label: 'Front-end', tags: ['React', 'Livewire', 'Tailwind'] },
	{
		label: 'Dados & IA',
		tags: ['Python', 'Pandas', 'SQL / PostgreSQL', 'Jupyter', 'Streamlit', 'Claude'],
	},
];

export interface FaqItem {
	question: string;
	answer: string;
}

export const faqItems: FaqItem[] = [
	{
		question: 'Você atende projetos fora do seu trabalho na DevStats?',
		answer: 'Sim, atendo.',
	},
	{
		question: 'Que tipo de projeto você aceita?',
		answer:
			'Landing pages e sites institucionais, criação de sistemas web, análise de dados e automações.',
	},
	{
		question: 'Como funciona o orçamento?',
		answer:
			'Depois de entender o que você precisa, envio um orçamento fechado, sem surpresa no meio do caminho.',
	},
];

export interface Channel {
	label: string;
	href: string;
	external?: boolean;
}

export const channels: Channel[] = [
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/daniel-felipe-fagundes',
		external: true,
	},
	{ label: 'GitHub', href: site.github, external: true },
	{
		label: 'Instagram',
		href: 'https://www.instagram.com/danielfagundes.dev',
		external: true,
	},
	{ label: 'E-mail', href: `mailto:${site.email}` },
];

export const contact = {
	eyebrow: 'Tem uma ideia?',
	title: 'Vamos construir',
	titleSoft: 'isso juntos.',
	lead: 'Me conte o que você precisa. Eu respondo com um diagnóstico honesto, inclusive se a resposta for que você não precisa de um desenvolvedor.',
	cta: 'Enviar mensagem',
	name: 'Daniel Fagundes',
	backToTop: 'Voltar ao topo',
} as const;

function padIndex(index: number): string {
	return String(index + 1).padStart(2, '0');
}

export function sectionIndex(index: number): string {
	return padIndex(index);
}
