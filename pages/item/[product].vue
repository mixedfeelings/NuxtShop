<template :key="handle">
	<div class="bg-natural">
		<div v-if="product">
			<Html>
				<Head v-if="product?.title && product?.description">
					<Title>{{ product.title }} | Issue Press</Title>
					<Meta name="description" :content="product.description" />
					<Meta name="twitter:card" content="summary_large_image" />
					<Meta name="twitter:site" content="@issuepress" />
					<Meta
						property="twitter:image"
						:content="product?.images.edges[0]?.node.url"
					/>
					<Meta property="og:title" :content="`${meta_title} | Issue Press`" />
					<Meta propert="og:description" :content="product.description" />
					<Meta
						property="og:url"
						:content="`https://issue.press${route.path}`"
					/>
					<Meta property="og:type" content="product" />
					<Meta
						Propety="product:price"
						:content="product?.priceRange?.minVariantPrice?.amount"
					/>
					<Meta
						property="product:price.currency"
						:content="product?.priceRange?.minVariantPrice?.currencyCode"
					/>
					<Meta
						v-if="product?.images?.edges[0].node.url"
						property="og:image"
						:content="product?.images.edges[0]?.node.url"
					/>
					<Meta
						v-if="product?.images?.edges[0].node.width"
						property="og:image:width"
						:content="`${product?.images.edges[0]?.node.width}`"
					/>
					<Meta
						v-if="product?.images?.edges[0].node.height"
						property="og:image:height"
						:content="`${product?.images.edges[0]?.node.height}`"
					/>
					<Meta
						v-if="product?.images?.edges[0].node.altText"
						property="og:image:alt"
						:content="product?.images.edges[0]?.node.altText"
					/>
				</Head>
			</Html>

			<carousel
				ref="carouselRef"
				v-if="show_images"
				:settings="settings"
				:breakpoints="breakpoints"
				:wrap-around="true"
			>
				<slide v-for="(image, index) in images" :index="index" :key="index">
					<div class="carousel__item">
						<img
							:src="image.node.url"
							@click="onImageClick(index)"
							class="cursor-pointer"
							:alt="image.node.altText ?? `Excerpt of ${meta_title}`"
						/>
					</div>
				</slide>
				<template #addons>
					<navigation v-if="has_more_than_one_image" />
					<pagination v-if="has_more_than_one_image" />
				</template>
			</carousel>
			<section class="py-6 md:py-8 px-6 bg-natural">
				<div class="container mx-auto">
					<div v-if="sku" v-text="sku" class="pb-2"></div>
					<ProductTitle
						tag="h1"
						:title="product.title"
						variant="product"
						class="text-2xl md:text-3xl lg:text-4xl font-serif tracking-wide mb-2"
					></ProductTitle>
					<div v-if="artist" class="artist text-base md:text-lg my-1 font-mono">
						by
						<NuxtLink :to="`/artists/${formatText(artist)}`">{{
							artist
						}}</NuxtLink>
						<span v-if="artist2"
							>&
							<NuxtLink :to="`/artists/${formatText(artist2)}`">{{
								artist2
							}}</NuxtLink>
						</span>
					</div>

					<div class="flex items-center gap-6 flex-wrap pt-4">
						<ProductPrice
							:priceRange="product.priceRange"
							:compareAtPriceRange="product.compareAtPriceRange"
						></ProductPrice>
						<ProductVariants
							v-model="selected_variant"
							label="Select option"
							:variants="variants"
							:default-variant="default_variant"
						></ProductVariants>
						<ProductAddToCart :label="button_label"></ProductAddToCart>
					</div>

					<div class="text-base md:text-2xl pt-6">
						<ProductDescription
							:description="product.descriptionHtml"
							class="product-description"
						></ProductDescription>
						<div
							class="metadata pt-6 font-mono whitespace-pre-wrap text-base gap-y-2"
						>
							<div v-if="year" class="metafield-wrapper">
								<span class="metafield-label">Year: </span>{{ year }}
							</div>

							<div class="metafield-wrapper">
								<span class="metafield-label">Type: </span
								><NuxtLink
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
									></NuxtLink>
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
						/>
					</div>
				</slide>
				<template #addons>
					<navigation v-if="has_more_than_one_image"></navigation>
				</template>
			</carousel>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
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
			break;
		default:
			return "light-option";
			break;
	}
}

const myCarousel = ref(null);
const show_modal = ref(false);
const selected_variant = ref("");

const settings = ref({
	itemsToShow: 1,
});

const breakpoints = ref({
	700: {
		itemsToShow: 1.5,
	},
	// 1024 and up
	1024: {
		itemsToShow: 2.5,
	},
});

const colorStore = useColorStore();
const route = useRoute();
const handle = route.params.product;

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
	if (Array.isArray(x)) return x; // already edges[]
	if (Array.isArray(x?.edges)) return x.edges; // got connection
	return [];
}

//METADATA
const artist = computed(() => product.value.artist?.value ?? "");
const artist2 = computed(() => product.value.artist2?.value ?? "");
const sku = computed(() => product.value?.variants?.edges[0]?.node?.sku ?? "");
const inkColors = computed(() =>
	product.value.inkColors ? JSON.parse(product.value.inkColors.value) : ""
);
const papers = computed(() =>
	product.value.papers ? JSON.parse(product.value.papers.value) : ""
);
const binding = computed(() =>
	product.value.binding ? JSON.parse(product.value.binding.value) : ""
);
const process = computed(() =>
	product.value.process ? JSON.parse(product.value.process.value) : ""
);
const dimensions = computed(() =>
	product.value.dimensions ? product.value.dimensions.value : ""
);
const pages = computed(() =>
	product.value.pages ? product.value.pages.value : ""
);
const editionSize = computed(() =>
	product.value.edition_size ? JSON.parse(product.value.edition_size.value) : ""
);
const cover = computed(() =>
	product.value.cover ? product.value.cover.value : ""
);

const year = computed(() => {
	if (product.value.date?.value) {
		const date = new Date(`${product.value.date?.value}`);
		return date.getUTCFullYear();
	}
});
const metadata = computed(() => product.value.metadata?.value ?? "");

// Product Image
const src = computed(() => product.value.images?.edges[0]?.node?.url ?? "");
const sizes = `(max-width: ${breakpointsTailwind.md}px) 95vw, 40vw`;
const srcset = computed(() => getSrcset(src.value || ""));

const show_images = computed(() => product.value.images?.edges.length > 0);
const has_more_than_one_image = computed(
	() => product.value.images?.edges.length > 2
);

const imageIndexById = computed(() => {
	const map = new Map<string, number>();
	images.value.forEach((edge, i) => {
		if (edge?.node?.id) map.set(edge.node.id, i);
	});
	return map;
});

function slideToVariantImage(variantId: string) {
	const variant = variants.value.find((v) => v.node.id === variantId)?.node;
	const imageId = variant?.image?.id;
	if (!imageId) return; // variant might not have an image

	const idx = imageIndexById.value.get(imageId);
	if (idx == null) return;

	// use vue3-carousel's slideTo(index, skipTransition)
	nextTick(() => {
		carouselRef.value?.slideTo(idx, false);
	});
}

const default_variant = computed(() => {
	if (
		product.value.variants?.edges.length > 1 ||
		!product.value.availableForSale
	) {
		return "";
	} else {
		return product.value?.variants?.edges[0]?.node?.id;
	}
});

const button_label = computed(() => {
	if (!product.value.availableForSale) {
		return "Sold Out";
	} else {
		return "";
	}
});

function onImageClick(i: number) {
	this.toggleModal();
	nextTick(() => {
		this.myCarousel.slideTo(i);
	});
}

function toggleModal() {
	this.show_modal = !this.show_modal;
}

watch(
	selected_variant,
	(newId) => {
		if (newId) slideToVariantImage(newId);
	},
	{ immediate: true }
);

// SEO
const meta_title = computed(() => {
	let tc = product?.value.title;
	if (artist.value) {
		tc += ` by ${artist.value}`;
	} else if (artist2.value) {
		tc += ` & ${artist2.value}`;
	}
	return tc;
});

// Fetch fresh inventory on client
onMounted(() => {
	const { result: clientResult, onResult } = useQuery(
		productVariantsByHandle,
		{ handle },
		{ fetchPolicy: "network-only" }
	);
	const clientVariants = useResult(
		clientResult,
		[],
		(data) => data.productByHandle.variants.edges
	);
	variants.value = clientVariants;

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

<style scoped>
.card-image-wrapper {
	@apply relative block w-full z-0;
	height: 0;
	padding-bottom: 100%;
}

.card-image-wrapper.thumbnail {
	padding-bottom: 100%;
}

.card-image-wrapper .card-image-inner {
	@apply flex flex-1 absolute w-full h-full items-center justify-center;
}

.card-image-wrapper .card-image-inner img {
	height: auto;
	max-width: 90%;
	max-height: 90%;
	width: auto;
}

.metadata {
	white-space: pre-wrap;
}

.metafield-wrapper {
	@apply flex flex-wrap py-1 font-mono;
}

.metafield-wrapper .metafield-label {
	@apply font-bold;
}

.metafield-wrapper .ink-chip {
	@apply text-xs px-2 py-1 rounded cursor-pointer border;
}

.metafield-wrapper .ink-chip:hover {
	@apply underline bg-opacity-75;
}

.metafield-wrapper .dark-option:hover {
	color: white !important;
}

.metafield-wrapper .light-option:hover {
	color: black !important;
}

/* .close-icon:hover {
  fill: var(--global-color); 
} */

/* .fullWidthImage {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: absolute;
} */
</style>
