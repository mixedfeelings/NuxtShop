import { defineNuxtConfig } from "nuxt3";

export default defineNuxtConfig({
	publicRuntimeConfig: {
		SHOPIFY_STOREFRONT_ENDPOINT: process.env.SHOPIFY_STOREFRONT_ENDPOINT,
		SHOPIFY_STOREFRONT_ACCESS_TOKEN:
			process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
	},
	buildModules: ["@pinia/nuxt", "@vueuse/nuxt"],
	alias: {
		colorMode: "@nuxtjs/color-mode",
	},
	nitro: { externals: { inline: ["tslib", "graphql-tag"] } },
	colorMode: {
		preference: "system", // default value of $colorMode.preference
		fallback: "light", // fallback value if not system preference found
		hid: "nuxt-color-mode-script",
		globalName: "__NUXT_COLOR_MODE__",
		componentName: "ColorScheme",
		classPrefix: "",
		classSuffix: "-mode",
		storageKey: "nuxt-color-mode",
	},
	build: {
		transpile: [
			"@apollo/client",
			"@vue/apollo-composable",
			"ts-invariant/process",
		],
		postcss: {
			postcssOptions: {
				plugins: {
					tailwindcss: {},
					autoprefixer: {},
				},
			},
		},
	},
	css: ["~/assets/css/fonts.css", "~/assets/css/global.css"],
});
