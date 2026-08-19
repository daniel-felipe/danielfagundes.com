// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://danielfagundes.com',
	integrations: [
		sitemap({
			i18n: {
				defaultLocale: 'pt-br',
				locales: {
					'pt-br': 'pt-BR',
					en: 'en',
				},
			},
		}),
	],
	i18n: {
		locales: ['pt-br', 'en'],
		defaultLocale: 'pt-br',
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
