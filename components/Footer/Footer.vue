<template>
	<footer class="p-6 border-t-2">
		<div class="">
			<p class="pt-2 text-center text-sm">
				<em
					>Independent <NuxtLink to="/shop">artist publishing</NuxtLink> &
					<NuxtLink to="/printing">Risograph printing</NuxtLink> from Grand
					Rapids, Michigan</em
				>
			</p>
			<ul
				class="flex flex-col md:flex-row justify-center md:items-center gap-x-6 gap-y-2 leading-none text-xs leading-none flex-wrap"
			>
				<li class="flex items-center justify-center gap-1">
					<span class="text-base leading-none" name="copyright">©</span>
					2011–{{ new Date().getFullYear() }}
					<NuxtLink to="/">Issue Press</NuxtLink>
				</li>
				<li
					v-for="(policy, key) in availablePolicies"
					:key="key"
					class="flex justify-center"
				>
					<NuxtLink
						:to="`/policies/${toKebab(key)}`"
						class="underline hover:no-underline"
					>
						{{ policy.title }}
					</NuxtLink>
				</li>
			</ul>
		</div>
	</footer>
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
