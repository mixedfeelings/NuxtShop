<template v-if="colorStore.globalColor">
	<Header />
	<Cart />
	<main class="min-h-[75vh]">
		<div
			v-if="
				config.SHOPIFY_STOREFRONT_ENDPOINT &&
				config.SHOPIFY_STOREFRONT_ACCESS_TOKEN
			"
		>
			<NuxtPage />
		</div>
	</main>
	<Footer />
</template>

<script lang="ts" setup>
import "~/assets/css/tailwind.css";
import { useShopStore } from "~/stores/shop";

useMeta({
	htmlAttrs: {
		lang: "en",
	},
	link: [
		{
			rel: "icon",
			type: "image/x-icon",
			href: "/favicon.ico",
			sizes: "any",
		},
		{
			rel: "icon",
			type: "image/svg+xml",
			href: "/icon.svg",
		},
		{
			rel: "icon",
			type: "image/x-icon",
			href: "/favicon-128.png",
		},
		{
			rel: "icon",
			type: "image/x-icon",
			href: "/favicon-192.png",
		},
		{
			rel: "apple-touch-icon",
			type: "image/x-icon",
			href: "/favicon-180.png",
		},
	],
	script: [
		{
			src: "https://www.googletagmanager.com/gtag/js?id=UA-22429627-1",
			async: true,
			type: "text/javascript",
		},
		{
			children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'UA-22429627-1');
      `,
			type: "text/javascript",
		},
	],
});

// Global Store Actions
const { pending, error } = await useAsyncData("shop", () => {
	const shopStore = useShopStore();
	return shopStore.getShopGlobals();
});

const config = useRuntimeConfig();
</script>
