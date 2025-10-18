<template>
	<div>
		<Html>
			<Head>
				<Title>Policies | Issue Press</Title>
				<Meta
					name="description"
					content="Read Issue Press policies on shipping, refunds, and more. All items are handmade in small, limited runs."
				/>
			</Head>
		</Html>

		<section class="w-full md:w-3/5 md:mx-auto py-10 px-6">
			<h1 class="font-serif text-2xl md:text-3xl lg:text-4xl text-center">
				Policies
			</h1>

			<ul class="mt-8 space-y-4">
				<li
					v-for="(policy, key) in availablePolicies"
					:key="key"
					class="text-center"
				>
					<NuxtLink
						:to="`/policies/${toKebab(key)}`"
						class="text-lg underline hover:no-underline"
					>
						{{ policy.title }}
					</NuxtLink>
				</li>
			</ul>
		</section>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery, useResult } from "@vue/apollo-composable";
import { policies } from "~~/apollo/queries/policies";

// fetch shop policies
const { result } = useQuery(policies);
const policiesData = useResult(result, null, (data) => data.shop);

// helper: camelCase → kebab-case
const toKebab = (str: string) =>
	str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

// filter out null policies
const availablePolicies = computed(() => {
	if (!policiesData.value) return {};
	return Object.fromEntries(
		Object.entries(policiesData.value).filter(([_, val]) => val && val.title)
	);
});
</script>
