// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Must be the live origin: static `og:image` URLs are baked from this at build time.
	site: 'https://danielfagundes.vercel.app',
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
	build: {
		inlineStylesheets: 'always',
	},
	vite: {
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes('node_modules/gsap')) return 'gsap';
						if (id.includes('node_modules/ogl')) return 'ogl';
					},
				},
			},
		},
	},
});
