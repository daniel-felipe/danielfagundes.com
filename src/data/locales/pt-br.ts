import type { HomeCopy } from '../home';

export const ptBr: HomeCopy = {
	htmlLang: 'pt-BR',
	email: 'contato@danielfagundes.com',
	github: 'https://github.com/daniel-felipe',
	meta: {
		title: 'Daniel Fagundes | Full-Stack Developer',
		description:
			'Daniel Fagundes, desenvolvedor Full-Stack e engenheiro de software na DevStats. Sistemas web com Laravel, React, Python e IA aplicada.',
	},
	nav: {
		skipToContent: 'Pular para o conteúdo',
		brandAria: 'Daniel Fagundes, início',
		menuAria: 'Navegação principal',
		themeToggle: 'Alternar tema',
		langAria: 'Idioma',
		links: [
			{ href: '#projetos', label: 'Projetos' },
			{ href: '#servicos', label: 'Serviços', optional: true },
			{ href: '#contato', label: 'Contato' },
		],
	},
	hero: {
		firstName: 'Daniel',
		lastName: 'Fagundes',
		p1: 'Olá, eu sou o Daniel. Sou desenvolvedor Full-Stack e engenheiro de software na DevStats. No dia a dia, construo sistemas web com Laravel e React.',
		p2: 'Fora do trabalho, crio projetos próprios e exploro temas que me despertam curiosidade, como dados, IA e cibersegurança, utilizando tecnologias como Python.',
		workLink: 'Dê uma olhada no que já construí.',
		contactCta: 'Entrar em contato',
		githubCta: 'GitHub',
	},
	marquee: [
		{ label: 'Construir.' },
		{ label: 'Integrar.', outline: true },
		{ label: 'Automatizar.' },
		{ label: 'Analisar.', outline: true },
	],
	projects: {
		title: 'Trabalhos recentes',
		items: [
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
		],
	},
	services: {
		title: 'Serviços',
		lead: 'O que eu faço, na prática:',
		view: '( Ver )',
		close: '( Fechar )',
		items: [
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
		],
	},
	tools: {
		title: 'Ferramentas que uso',
		groups: [
			{ label: 'Back-end', tags: ['PHP', 'Laravel'] },
			{ label: 'Front-end', tags: ['React', 'Livewire', 'Tailwind'] },
			{
				label: 'Dados & IA',
				tags: ['Python', 'Pandas', 'SQL / PostgreSQL', 'Jupyter', 'Streamlit', 'Claude'],
			},
		],
	},
	faq: {
		title: 'FAQ',
		items: [
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
		],
	},
	contact: {
		eyebrow: 'Tem uma ideia?',
		title: 'Vamos construir',
		titleSoft: 'isso juntos.',
		lead: 'Me conte o que você precisa. Eu respondo com um diagnóstico honesto, inclusive se a resposta for que você não precisa de um desenvolvedor.',
		cta: 'Enviar mensagem',
		name: 'Daniel Fagundes',
		backToTop: 'Voltar ao topo',
		channelsAria: 'Canais',
		copied: 'copiado',
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
			{ label: 'E-mail', href: 'mailto:contato@danielfagundes.com' },
		],
	},
};
