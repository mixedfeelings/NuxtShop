<template>
	<div class="cart-item flex w-full pb-4 mb-4 border-b-2 border-black">
		<div class="w-20 max-h-24 flex items-center justify-center mr-4">
			<img
				:src="image_url"
				:alt="alt_text"
				width="160"
				height="160"
				class="block object-contain w-auto h-auto max-h-20"
			/>
		</div>

		<div class="w-full flex flex-col justify-between">
			<div class="flex items-start justify-between w-full text-sm w-full">
				<div class="w-full">
					<div class="text-sm font-serif">
						{{ item.merchandise.product.title }}
					</div>
					<div
						v-for="option in variantOptions"
						:key="option.value"
						class="flex"
					>
						<template v-if="option.value !== 'Default Title'">
							<div class="opacity-70">{{ option.value }}</div>
						</template>
					</div>
				</div>
				<button class="ml-4">
					<TrashIcon
						class="inline w-4"
						@click="removeItem"
						@keyup.enter="removeItem"
					></TrashIcon>
				</button>
			</div>
			<div class="flex items-center mt-2 justify-between">
				<CartQuantityPicker
					v-model="item.quantity"
					:id="item.id"
				></CartQuantityPicker>
				<div>{{ formattedPrice }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import TrashIcon from "@heroicons/vue/solid/TrashIcon.js";
import { formatLocalePrice } from "~/utils/money";
import { useCartStore } from "~/stores/cart";
import CartQuantityPicker from "./CartQuantityPicker.vue";

// TO-DO: Add item type def
const props = defineProps<{
	item: any;
}>();

const cartStore = useCartStore();

const image_url =
	props.item?.merchandise?.image?.url ??
	props.item?.merchandise?.product?.featuredImage?.thumbnailUrl ??
	"";
const alt_text =
	props.item?.merchandise?.image?.altText ??
	props.item?.merchandise?.product?.featuredImage?.altText ??
	"";
const id = props.item?.id;
const variantOptions = props.item?.merchandise?.selectedOptions ?? null;

const removeItem = () => cartStore.cartLinesRemove(id);

const currencyCode =
	props.item?.estimatedCost?.subtotalAmount?.currencyCode ?? "";
const formattedPrice = computed(() =>
	formatLocalePrice(
		props.item?.estimatedCost?.subtotalAmount?.amount,
		"en-US",
		currencyCode
	)
);
</script>

<style scoped>
.cart-item {
	-webkit-backface-visibility: visible;
	backface-visibility: visible;
	-webkit-animation: 200ms flipIn forwards;
	animation: 200ms flipIn forwards;
}
</style>
