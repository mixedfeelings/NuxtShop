<!-- components/RelatedByTagsGrid.vue -->
<template>
	<div v-if="scored.length">
		<h2
			v-if="title"
			class="col-span-2 font-bold md:col-span-3 py-6 text-center font-serif"
		>
			{{ title }}
		</h2>

		<ProductGrid>
			<ProductCard
				v-for="({ product }, index) in scored"
				:key="product.id"
				:index="index"
				:product="product"
				:catalog-item="catalogItem"
				class="w-1/2 md:w-1/3 lg:w-1/4"
			/>
		</ProductGrid>
	</div>

	<div
		v-else-if="!loading && !error"
		class="py-4 text-center text-sm opacity-70"
	>
		No related products in stock.
	</div>
	<div v-else-if="error">Error loading related products</div>
	<div v-else></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";

const props = defineProps<{
	productId: string;
	productTags: string[];
	artist?: string | null;
	limit?: number;
	title?: string;
	catalogItem?: boolean;
	sameVendor?: string | null;
	sameProductType?: string | null;
}>();

const title = props.title ?? "Related products";
const catalogItem = props.catalogItem ?? false;
const limit = props.limit ?? 8;

// --- Safe esc helper (no replaceAll, SSR-friendly)
const esc = (v: unknown) =>
	String(v ?? "")
		.replace(/\\/g, "\\\\") // escape backslashes first
		.replace(/'/g, "\\'"); // then single quotes

// Build Storefront search string: (tag:'A' OR tag:'B') AND available_for_sale:true ...
const queryString = computed(() => {
	const tags = (props.productTags || [])
		.filter((t): t is string => !!t && t.length > 0)
		.map((t) => `tag:'${esc(t)}'`);

	if (!tags.length) return "";

	const vendor = props.sameVendor
		? ` AND vendor:'${esc(props.sameVendor)}'`
		: "";
	const ptype = props.sameProductType
		? ` AND product_type:'${esc(props.sameProductType)}'`
		: "";

	return `(${tags.join(" OR ")})${vendor}${ptype} AND available_for_sale:true`;
});

const enabled = computed(() => queryString.value.length > 0);

// GraphQL: pull a generous pool, then score client-side
const PRODUCTS_BY_TAGS = gql`
	query ProductsByTags($first: Int!, $query: String!) {
		products(first: $first, query: $query) {
			edges {
				node {
					id
					handle
					title
					tags
					vendor
					productType
					availableForSale
					createdAt
					images(first: 1) {
						edges {
							node {
								url
								altText
							}
						}
					}
					priceRange {
						minVariantPrice {
							amount
							currencyCode
						}
						maxVariantPrice {
							amount
							currencyCode
						}
					}
					artist: metafield(namespace: "issuepress", key: "artist") {
						value
						type
					}
				}
			}
		}
	}
`;

const { result, error, loading } = useQuery(
	PRODUCTS_BY_TAGS,
	() => ({ first: 50, query: queryString.value }),
	{ enabled }
);

const candidates = useResult(result, [], (data) =>
	(data?.products?.edges ?? [])
		.map((e: any) => e.node)
		.filter((n: any) => n?.id && n.id !== props.productId && n.availableForSale)
);

// Score by tag overlap; highest first
// --- helpers: normalize + tokenize artist strings
const norm = (v: unknown) =>
	String(v ?? "")
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "") // strip diacritics
		.replace(/[’'"]/g, "") // unify quotes
		.replace(/[.,/#!$%^&*;:{}=_`~()]/g, " ") // drop punctuation
		.replace(/\s+/g, " ") // collapse spaces
		.trim()
		.toLowerCase();

const splitArtists = (v: unknown): string[] => {
	const s = norm(v);
	if (!s) return [];
	// split on common separators: comma, ampersand, slash, " x ", "feat", "with"
	return s
		.split(/\s*(?:,|&|\/| x | feat\.?| with )\s*/g)
		.map((x) => x.trim())
		.filter(Boolean);
};

const scored = computed(() => {
	const tagSet = new Set((props.productTags || []).filter(Boolean));
	const currentArtists = [...splitArtists(props.artist)];
	const currentArtistSet = new Set(currentArtists);

	return candidates.value
		.map((p: any) => {
			// base tag overlap
			const tags: string[] = p.tags || [];
			const overlapScore = tags.reduce(
				(acc, t) => acc + (tagSet.has(t) ? 1 : 0),
				0
			);

			// target product artists (tokenized)
			const prodArtists = [...splitArtists(p.artist?.value)];

			// any intersection?
			const artistMatch = prodArtists.some((a) => currentArtistSet.has(a));
			// weight: big bump if any artist overlaps
			const artistScore = artistMatch ? 25 : 0;

			return {
				product: p,
				score: overlapScore + artistScore,
				artistMatch,
				createdAt: new Date(p.createdAt),
			};
		})
		.filter((x) => x.score > 0)
		.sort((a, b) => {
			// 1) artist matches first
			if (a.artistMatch !== b.artistMatch) return a.artistMatch ? -1 : 1;
			// 2) then by combined score
			if (b.score !== a.score) return b.score - a.score;
			// 3) then newest first
			return b.createdAt.getTime() - a.createdAt.getTime();
		})
		.slice(0, limit);
});
</script>
