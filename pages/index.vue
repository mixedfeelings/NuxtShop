<template>
	<section class="py-8">
		<Html>
			<Head>
				<Title
					>Issue Press – Limited-run Risograph artist books exploring humor,
					history, and place</Title
				>
				<Meta
					name="description"
					content="Issue Press is a tiny publisher and Risograph print shop based in Grand Rapids, Michigan"
				/>
				<Meta property="og:title" content="Issue Press" />
				<Meta property="og:site_name" content="Issue Press" />
				<Meta property="og:type" content="website" />
				<Meta property="og:url" content="https://issue.press/" />
				<Meta property="og:image" content="/issue-press.png" />
				<Meta name="twitter:card" content="summary" />
				<Meta name="twitter:site" content="@issuepress" />
			</Head>
		</Html>

		<h1 class="sr-only">Issue Press</h1>
		<p class="text-center mt-6">
			Limited-run works by artists exploring humor, history, place, and beyond.
		</p>
		<h2 class="text-center">In Print</h2>
		<FeaturedProducts collectionHandle="in-stock" :numberProducts="12" />
	</section>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useShopStore } from "~/stores/shop";
import { useColorStore } from "~/stores/colors";

const colorStore = useColorStore();
const colorMode = useColorMode();

const shopStore = useShopStore();
const { description } = storeToRefs(shopStore);

onMounted(() => {
	colorStore.setGlobalColor();
	document.documentElement.style.setProperty(
		"--global-color",
		`var(--color-${colorStore.globalColor})`
	);
	document.documentElement.style.setProperty(
		"--global-text-color",
		`var(--color-${colorStore.globalTextColor})`
	);
});
</script>
