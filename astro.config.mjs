// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://danielfagundes.com',
	i18n: {
		locales: ['pt-br', 'en'],
		defaultLocale: 'pt-br',
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
