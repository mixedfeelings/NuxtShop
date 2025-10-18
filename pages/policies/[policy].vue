<template>
	<div>
		<Html>
			<Head>
				<Title
					>{{ policiesData?.[selectedPolicy]?.title }} | Policies | Issue
					Press</Title
				>
				<Meta
					name="description"
					content="{{ policiesData?.[selectedPolicy]?.title }} for Issue Press, a tiny publisher and Risograph print shop based in Grand Rapids, Michigan."
				/>
				<Meta
					property="og:title"
					content="`{{ policiesData?.[selectedPolicy]?.title }} | Policies | Issue Press`"
				/>
				<Meta property="og:site_name" content="Issue Press" />
				<Meta property="og:type" content="article" />
				<Meta
					property="og:url"
					content="https://issue.press/policies/{{ route.params.policy }}"
				/>
				<Meta property="og:image" content="/issue-press.png" />
				<Meta name="twitter:card" content="summary" />
				<Meta name="twitter:site" content="@issuepress" />
			</Head>
		</Html>

		<section class="w-full md:w-3/5 md:mx-auto py-10 px-6">
			<h1 class="font-serif text-2xl md:text-3xl lg:text-4xl text-center">
				{{ policiesData?.[selectedPolicy]?.title }}
			</h1>

			<div
				class="mt-6 prose prose-lg max-w-none"
				v-html="policiesData?.[selectedPolicy]?.body"
			></div>
		</section>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "#imports"; // Nuxt auto-import, ok to omit if configured
import { useColorStore } from "~/stores/colors";
import { useQuery, useResult } from "@vue/apollo-composable";
import { policies } from "~~/apollo/queries/policies";

const colorStore = useColorStore();
const route = useRoute();

const toCamel = (str: string) =>
	str.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());

// query
const { result } = useQuery(policies);
// shop object (shippingPolicy, refundPolicy, etc.)
const policiesData = useResult(result, null, (data) => data.shop);

// normalize the dynamic route param -> camelCase key (e.g., refund-policy -> refundPolicy)
const selectedPolicy = computed(() => {
	const p = route.params.policy;
	const asString = Array.isArray(p) ? p[0] : p ?? "";
	return toCamel(asString);
});

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
