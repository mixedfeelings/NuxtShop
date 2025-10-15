<template>
	<NuxtLink class="card" :to="productPath">
		<div class="card-image-wrapper">
			<div class="card-image-inner">
				<ProductImage
					:alt="altText"
					:height="height"
					:lazy="index > lazyLoadingThreshold"
					:sizes="sizes"
					:srcset="srcset"
					:width="width"
					class=""
				/>
			</div>
		</div>
		<div class="card-body">
			<div
				v-if="artist && !catalogItem"
				class="text-xs mt-3 mb-1 font-mono"
				v-html="artist"
			/>
			<div
				v-if="catalogItem"
				class="text-xs mt-3 font-mono pb-1"
				v-html="product?.variants?.edges[0]?.node?.sku"
			/>
			<ProductTitle tag="span" :title="product.title" class="font-serif" />
			<ProductPrice
				v-if="!catalogItem"
				:priceRange="product.priceRange"
				:compareAtPriceRange="product.compareAtPriceRange"
				class="text-sm justify-center mt-1"
			/>
			<div v-if="catalogItem" class="catalog-data pt-1">
				<div v-if="!hideArtist" class="artist text-sm" v-html="artist" />
				<div class="project-type text-xs pt-1">
					{{ product.productType
					}}<span v-if="product.date?.value"
						>, {{ formateYear(product.date?.value) }}</span
					>
				</div>
			</div>
		</div>

		{{ score }}
	</NuxtLink>
</template>

<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";
import { getSrcset } from "~/utils/images";
import { storeToRefs } from "pinia";
import { useColorStore } from "~/stores/colors";

const props = defineProps<{
	product: ProductCard;
	index?: number;
	hideArtist?: boolean;
	catalogItem?: boolean;
	score?: number;
}>();

const productPath = `/item/${props.product.handle}`;

const lazyLoadingThreshold = 7;
const src = props.product?.images?.edges[0]?.node?.url ?? "";
const altText =
	props.product?.images?.edges[0]?.node?.altText ?? props.product?.handle;
const width = props.product?.images?.edges[0]?.node?.width ?? "";
const height = props.product?.images?.edges[0]?.node?.height ?? "";
const sizes = ``;
const srcset = getSrcset(src);
const artist = computed(() => {
	if (!props.hideArtist) {
		if (props.product?.artist2?.value) {
			return `${props.product?.artist?.value} & ${props.product?.artist2?.value}`;
		}
		return props.product?.artist?.value ?? "";
	}
});
function formateYear(date: string) {
	const newDate = new Date(date);
	return newDate.getUTCFullYear();
}
</script>
