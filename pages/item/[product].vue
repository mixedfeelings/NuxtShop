<template :key="handle">
	<div class="bg-natural">
		<div v-if="product">
			<Html>
				<Head>
					<Title>{{ meta_title }} | Issue Press</Title>

					<!-- Canonical & robots -->
					<Link rel="canonical" :href="`https://issue.press${route.path}`" />
					<Meta name="robots" content="index,follow" />

					<Meta name="description" :content="product.description" />

					<!-- Open Graph -->
					<Meta property="og:type" content="product" />
					<Meta property="og:site_name" content="Issue Press" />
					<Meta property="og:title" :content="`${meta_title} | Issue Press`" />
					<Meta property="og:description" :content="product.description" />
					<Meta
						property="og:url"
						:content="`https://issue.press${route.path}`"
					/>
					<Meta
						v-if="product?.images?.edges?.[0]?.node?.url"
						property="og:image"
						:content="product?.images?.edges?.[0]?.node?.url"
					/>
					<Meta
						v-if="product?.images?.edges?.[0]?.node?.width"
						property="og:image:width"
						:content="`${product?.images?.edges?.[0]?.node?.width}`"
					/>
					<Meta
						v-if="product?.images?.edges?.[0]?.node?.height"
						property="og:image:height"
						:content="`${product?.images?.edges?.[0]?.node?.height}`"
					/>
					<Meta
						v-if="product?.images?.edges?.[0]?.node?.altText"
						property="og:image:alt"
						:content="product?.images?.edges?.[0]?.node?.altText"
					/>

					<!-- Product price -->
					<Meta
						v-if="product?.priceRange?.minVariantPrice?.amount"
						property="product:price:amount"
						:content="product?.priceRange?.minVariantPrice?.amount"
					/>
					<Meta
						v-if="product?.priceRange?.minVariantPrice?.currencyCode"
						property="product:price:currency"
						:content="product?.priceRange?.minVariantPrice?.currencyCode"
					/>

					<!-- Twitter -->
					<Meta name="twitter:card" content="summary_large_image" />
					<Meta name="twitter:site" content="@issuepress" />
					<Meta
						v-if="product?.images?.edges?.[0]?.node?.url"
						name="twitter:image"
						:content="product?.images?.edges?.[0]?.node?.url"
					/>

					<Script type="application/ld+json" :children="structuredDataJson" />
				</Head>
			</Html>
			<ClientOnly>
				<carousel
					ref="carouselRef"
					v-if="show_images"
					:settings="settings"
					:breakpoints="breakpoints"
					:wrap-around="true"
				>
					<slide
						v-for="(image, index) in images"
						:index="index"
						:key="image.node.id"
					>
						<div class="carousel__item">
							<img
								:src="image.node.url"
								@click="onImageClick(index)"
								class="cursor-pointer"
								:alt="image.node.altText ?? `Excerpt of ${meta_title}`"
								loading="lazy"
								decoding="async"
							/>
						</div>
					</slide>
					<template #addons>
						<navigation v-if="has_more_than_one_image" />
						<pagination v-if="has_more_than_one_image" />
					</template>
				</carousel>
			</ClientOnly>

			<section class="py-6 md:py-8 px-6 bg-natural">
				<div class="container mx-auto">
					<div v-if="sku" v-text="sku" class="pb-2"></div>
					<ProductTitle
						tag="h1"
						:title="product.title"
						variant="product"
						class="text-2xl md:text-3xl lg:text-4xl font-serif tracking-wide mb-2"
					/>
					<div v-if="artist" class="artist text-base md:text-lg my-1 font-mono">
						by
						<NuxtLink :to="`/artists/${formatText(artist)}`">{{
							artist
						}}</NuxtLink>
						<span v-if="artist2">
							&
							<NuxtLink :to="`/artists/${formatText(artist2)}`">{{
								artist2
							}}</NuxtLink>
						</span>
					</div>

					<div class="flex items-center gap-6 flex-wrap pt-4">
						<ProductPrice
							:priceRange="product.priceRange"
							:compareAtPriceRange="product.compareAtPriceRange"
						/>
						<ProductVariants
							v-model="selected_variant"
							label="Select option"
							:variants="variants"
							:selectedVariant="selected_variant"
							@update:model-value="onUserVariantSelect"
						/>
						<ProductAddToCart :label="button_label" />
					</div>

					<div v-if="stock" :class="stock.class" v-html="stock.message"></div>

					<div class="text-base md:text-2xl pt-6">
						<ProductDescription
							:description="product.descriptionHtml"
							class="product-description"
						/>
						<div
							class="metadata pt-6 font-mono whitespace-pre-wrap text-base gap-y-2"
						>
							<div v-if="year" class="metafield-wrapper">
								<span class="metafield-label">Year: </span>{{ year }}
							</div>

							<div class="metafield-wrapper">
								<span class="metafield-label">Type: </span>
								<NuxtLink
									class="underline"
									:to="`/collections/${formatText(product.productType)}s`"
									>{{ product.productType }}</NuxtLink
								>
							</div>

							<div v-if="dimensions" class="metafield-wrapper">
								<span class="metafield-label">Dimensions: </span
								>{{ dimensions }}
							</div>

							<div v-if="pages" class="metafield-wrapper">
								<span class="metafield-label">Pages: </span>{{ pages }}
							</div>

							<div v-if="cover" class="metafield-wrapper">
								<span class="metafield-label">Cover: </span>{{ cover }}
							</div>

							<div v-if="binding" class="metafield-wrapper">
								<span class="metafield-label">Binding: </span
								>{{ binding.join(", ") }}
							</div>

							<div v-if="process" class="metafield-wrapper">
								<span class="metafield-label">Process: </span
								>{{ process.join(", ") }}
							</div>

							<div
								v-if="inkColors"
								class="metafield-wrapper gap-y-1 items-center"
							>
								<span class="metafield-label"
									>Ink Color<span v-if="inkColors.length > 1">s</span>:
								</span>
								<div class="flex flex-wrap gap-2 items-center">
									<NuxtLink
										:to="`/collections/${formatText(color)}`"
										v-for="color in inkColors"
										:key="color"
										:class="`ink-chip ${lod(color)}`"
										:style="`background-color: var(--color-${formatText(
											color
										)});`"
										v-text="color"
									/>
								</div>
							</div>

							<div v-if="papers" class="metafield-wrapper">
								<span class="metafield-label">Paper: </span
								>{{ papers.join(", ") }}
							</div>

							<div v-if="editionSize" class="metafield-wrapper">
								<span class="metafield-label">Edition Size: </span
								>{{ editionSize.join(", ") }}
							</div>

							<div v-if="metadata" class="metafield-wrapper">
								<span class="metafield-label">Notes: </span>{{ metadata }}
							</div>
						</div>
					</div>
				</div>
			</section>
			<section class="py-6 md:py-8 px-6 bg-white">
				<RelatedProducts
					:product-id="product.id"
					:product-tags="product.tags"
					:same-vendor="product.vendor"
					:artist="artist"
					:limit="4"
					title="Related Works"
				/>
			</section>
		</div>
		<div v-else></div>
		<div v-if="error">Error</div>
		<div v-if="show_modal" class="modal">
			<button
				class="flex items-center justify-center z-20 absolute top-4 right-4"
				aria-label="close"
				@click="toggleModal()"
				@keyup.enter="toggleModal()"
			>
				<CloseIcon class="close-icon w-6" aria-hidden />
			</button>
			<ClientOnly>
				<carousel v-if="show_images" ref="myCarousel" :wrap-around="true">
					<slide
						v-for="(image, index) in images"
						:index="index"
						:key="image.node.id"
					>
						<div class="p-6">
							<img
								:src="image.node.url"
								style="max-height: 90vh"
								:alt="image.node.altText ?? `Excerpt of ${meta_title}`"
								loading="lazy"
								decoding="async"
							/>
						</div>
					</slide>
					<template #addons>
						<navigation v-if="has_more_than_one_image"></navigation>
					</template>
				</carousel>
			</ClientOnly>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from "vue";
import CloseIcon from "@heroicons/vue/solid/XIcon.js";
import { useQuery, useResult } from "@vue/apollo-composable";
import { breakpointsTailwind } from "@vueuse/core";
import { getSrcset } from "~/utils/images";
import { productByHandle } from "~/apollo/queries/productByHandle";
import { productVariantsByHandle } from "~/apollo/queries/productVariantsByHandle";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { useColorStore } from "~/stores/colors";
import { slugify } from "~/utils/strings";

function formatText(text: string) {
	return slugify(text);
}

function lod(color: string) {
	switch (color) {
		case "Black":
		case "Blue":
		case "Brown":
		case "Burgundy":
		case "Moss":
		case "RISO-Federal Blue":
		case "Teal":
		case "Hunter Green":
		case "Purple":
		case "Light Gray":
			return "dark-option";
		default:
			return "light-option";
	}
}

const myCarousel = ref(null);
const show_modal = ref(false);
const selected_variant = ref("");
const userSelectedVariant = ref(false);
function onUserVariantSelect() {
	userSelectedVariant.value = true;
}
const routeChangeGuard = ref(false);

const settings = ref({ itemsToShow: 1 });

const breakpoints = ref({
	700: { itemsToShow: 1.5 },
	1024: { itemsToShow: 2.5 },
});

const colorStore = useColorStore();
const route = useRoute();
const router = useRouter();
const handle = route.params.product as string;

// Get product data
const { result, error } = useQuery(productByHandle, { handle });
const product: any = useResult(result, null, (data) => data.productByHandle);
const initialVariants = useResult(
	result,
	[],
	(data) => data.productByHandle.variants.edges
);
const variants = computed(() => toEdgesArray(initialVariants.value));
const images = computed(() => toEdgesArray(product.value?.images));

const carouselRef = ref(null);

function toEdgesArray<T = any>(x: any): T[] {
	if (Array.isArray(x)) return x;
	if (Array.isArray(x?.edges)) return x.edges;
	return [];
}

// METADATA
const artist = computed(() => product.value?.artist?.value ?? "");
const artist2 = computed(() => product.value?.artist2?.value ?? "");
const sku = computed(() => variant.value?.sku ?? "");
const inkColors = computed(() =>
	product.value?.inkColors ? JSON.parse(product.value.inkColors.value) : ""
);
const papers = computed(() =>
	product.value?.papers ? JSON.parse(product.value.papers.value) : ""
);
const binding = computed(() =>
	product.value?.binding ? JSON.parse(product.value.binding.value) : ""
);
const process = computed(() =>
	product.value?.process ? JSON.parse(product.value.process.value) : ""
);
const dimensions = computed(() =>
	product.value?.dimensions ? product.value.dimensions.value : ""
);
const pages = computed(() =>
	product.value?.pages ? product.value.pages.value : ""
);
const editionSize = computed(() =>
	product.value?.edition_size
		? JSON.parse(product.value.edition_size.value)
		: ""
);
const cover = computed(() =>
	product.value?.cover ? product.value.cover.value : ""
);

// Stock object (orange for low stock)
const stock = computed(() => {
	const qty = variant.value?.quantityAvailable ?? 0;
	if (qty > 9) {
		return {
			message: "In Stock",
			class: "stock pt-6 text-sm font-medium text-green",
		};
	} else if (qty > 0) {
		return {
			message: `Only <span class="font-medium">${qty}</span> left in stock`,
			class: "stock pt-6 text-sm font-medium text-orange",
		};
	} else {
		return null; // no message/class when sold out
	}
});

const year = computed(() => {
	if (product.value?.date?.value) {
		const date = new Date(`${product.value.date.value}`);
		return date.getUTCFullYear();
	}
});
const metadata = computed(() => product.value?.metadata?.value ?? "");

// Product Image
const src = computed(() => product.value?.images?.edges?.[0]?.node?.url ?? "");
const sizes = `(max-width: ${breakpointsTailwind.md}px) 95vw, 40vw`;
const srcset = computed(() => getSrcset(src.value || ""));

const show_images = computed(
	() => (product.value?.images?.edges?.length ?? 0) > 0
);
const has_more_than_one_image = computed(
	() => (product.value?.images?.edges?.length ?? 0) > 1
);

const imageIndexById = computed(() => {
	const map = new Map<string, number>();
	images.value?.forEach((e, i) => e?.node?.id && map.set(e.node.id, i));
	return map;
});

function slideToVariantImage(variantId: string) {
	const v = variants.value.find((e) => e.node.id === variantId)?.node;
	const imageId = v?.image?.id;
	if (!imageId) return;
	const idx = imageIndexById.value.get(imageId);
	if (idx == null) return;
	nextTick(() => {
		(carouselRef.value as any)?.slideTo(idx, false);
	});
}

const default_variant = computed(
	() => product.value?.variants?.edges?.[0]?.node?.id || ""
);

const button_label = computed(() =>
	!product.value?.availableForSale ? "Sold Out" : ""
);

const variant = computed(() => {
	if (!initialVariants.value?.length) return null;
	const idToFind = selected_variant.value || default_variant.value;
	if (!idToFind) return null;
	const edge = initialVariants.value.find((v) => v.node.id === idToFind);
	return edge ? edge.node : null;
});

// Variant Routes helpers
function extractNumericId(gid: string | undefined | null) {
	if (!gid) return null;
	return gid.split("/").pop();
}
function toShopifyGid(num: string | undefined | null) {
	if (!num) return null;
	return `gid://shopify/ProductVariant/${num}`;
}

function findVariantByIdOrHandle(v: string) {
	if (!v || !initialVariants.value?.length) return null;
	let edge = initialVariants.value.find((e) => e?.node?.id === v);
	if (edge) return edge.node;
	edge = initialVariants.value.find((e) => e?.node?.handle === v);
	return edge ? edge.node : null;
}

function setSelectedFromRoute() {
	const raw = route.query.variant;
	if (!raw) return;

	const str = Array.isArray(raw) ? String(raw[0]) : String(raw);
	const gid = str.startsWith("gid://") ? str : toShopifyGid(str);
	if (!gid) return;

	const match = initialVariants.value?.find((v) => v.node.id === gid);
	if (match) {
		routeChangeGuard.value = true;
		selected_variant.value = match.node.id;
	}
}

watch(
	() => route.query.variant,
	() => setSelectedFromRoute(),
	{ immediate: true }
);

// SEO
const meta_title = computed(() => {
	if (!product.value?.title) return "";
	const names = [artist.value, artist2.value].filter(Boolean).join(" & ");
	return names ? `${product.value.title} by ${names}` : product.value.title;
});

function stripHtml(html?: string | null) {
	if (!html) return "";
	return html
		.replace(/<style[\s\S]*?<\/style>/gi, "")
		.replace(/<script[\s\S]*?<\/script>/gi, "")
		.replace(/<[^>]+>/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function availabilityFromVariant(v: any) {
	if (v?.availableForSale && (v?.quantityAvailable ?? 0) > 0) {
		return "https://schema.org/InStock";
	}
	if (v?.availableForSale && v?.currentlyNotInStock) {
		return "https://schema.org/BackOrder";
	}
	return "https://schema.org/OutOfStock";
}

function productSchemaType(productType?: string) {
	if (!productType) return "Product";
	const type = productType.toLowerCase();
	if (
		type.includes("publication") ||
		type === "book" ||
		type.includes("book")
	) {
		return "Book";
	}
	return "Product";
}

const productUrlBase = computed(() => `https://issue.press${route.path}`);

function offerUrlForVariant(variantId: string, idx: number) {
	const edges = initialVariants.value || [];
	if (edges.length <= 1) return productUrlBase.value;
	const num = extractNumericId(variantId);
	return `${productUrlBase.value}?variant=${num}`;
}

const imagesForSchema = computed(() => {
	const arr = images.value?.map((e) => e?.node?.url).filter(Boolean) || [];
	return arr;
});

const offersForSchema = computed(() => {
	const edges = initialVariants.value || [];
	if (!edges.length) return undefined;
	return edges.map((edge, idx) => {
		const v = edge.node;
		return {
			"@type": "Offer",
			url: offerUrlForVariant(v.id, idx),
			priceCurrency:
				v?.price?.currencyCode ||
				product.value?.priceRange?.minVariantPrice?.currencyCode ||
				"USD",
			price:
				v?.price?.amount ||
				product.value?.priceRange?.minVariantPrice?.amount ||
				undefined,
			availability: availabilityFromVariant(v),
			sku: v?.sku || undefined,
			itemCondition: "https://schema.org/NewCondition",
		};
	});
});

const brandObj = computed(() => {
	const vendor = product.value?.vendor || "Issue Press";
	return { "@type": "Brand", name: vendor };
});

const structuredData = computed(() => {
	if (!product.value) return null;
	const schemaType = productSchemaType(product.value.productType);
	const name = product.value.title || "";
	const description = stripHtml(
		product.value.descriptionHtml || product.value.description || ""
	);
	const skuCurrent = variant.value?.sku || undefined;

	const base: any = {
		"@context": "https://schema.org",
		"@type": schemaType,
		name,
		image: imagesForSchema.value,
		description,
		brand: brandObj.value,
		url: productUrlBase.value,
		sku: skuCurrent,
		offers: offersForSchema.value,
	};

	if (schemaType === "Book") {
		const authors = [artist.value, artist2.value].filter(Boolean);
		if (authors.length) {
			base.author = authors.map((n) => ({ "@type": "Person", name: n }));
		}
		if (year.value) base.datePublished = String(year.value);
	}

	return base;
});

const structuredDataJson = computed(() =>
	structuredData.value ? JSON.stringify(structuredData.value, null, 2) : ""
);

onMounted(() => {
	const isClient = import.meta.client;

	const { result: clientResult } = useQuery(
		productVariantsByHandle,
		{ handle },
		{ fetchPolicy: "network-only" }
	);
	const clientVariants = useResult(
		clientResult,
		[],
		(d) => d.productByHandle.variants.edges
	);
	watch(clientVariants, (v) => {
		initialVariants.value = v;
	});
	watch(
		[initialVariants, () => route.query.variant],
		([list, q]) => {
			if (!list?.length) return;

			const raw = Array.isArray(q) ? q?.[0] : q;
			const str = raw ? String(raw) : "";
			const gid = str
				? str.startsWith("gid://")
					? str
					: toShopifyGid(str)
				: null;
			const fromUrl = gid ? list.find((e) => e.node.id === gid)?.node : null;
			if (fromUrl) {
				selected_variant.value = fromUrl.id;
				return;
			}
			if (list.length === 1) {
				selected_variant.value = list[0].node.id;
				return;
			}
			selected_variant.value = "";
		},
		{ immediate: true }
	);

	watch(
		selected_variant,
		(newId) => {
			if (!newId) return;

			// always sync the image
			slideToVariantImage(newId);

			// if the change came from the route, don't write back to the route
			if (routeChangeGuard.value) {
				routeChangeGuard.value = false;
				userSelectedVariant.value = false;
				return;
			}

			const hasMultiple = (initialVariants.value?.length ?? 0) > 1;

			// only add ?variant= for user-initiated changes on multi-variant products
			if (userSelectedVariant.value && hasMultiple) {
				const numeric = extractNumericId(newId);
				router.replace({ query: { ...route.query, variant: numeric } });
			} else if (!hasMultiple && route.query?.variant) {
				// strip ?variant on single-variant products
				const { variant, ...rest } = route.query as Record<string, any>;
				router.replace({ query: rest });
			}

			userSelectedVariant.value = false;
		},
		{ immediate: true }
	);

	watch(
		() => route.query.variant,
		() => setSelectedFromRoute(),
		{ immediate: true }
	);

	// Color theme setup
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

// Modal helpers
function onImageClick(i: number) {
	toggleModal();
	nextTick(() => {
		(myCarousel.value as any)?.slideTo(i);
	});
}
function toggleModal() {
	show_modal.value = !show_modal.value;
}
</script>
