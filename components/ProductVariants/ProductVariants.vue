<template>
	<select
		v-if="variants && variants.length > 1"
		class="form-select appearance-none block pl-3 pr-8 py-1.5 text-base font-normal bg-clip-padding bg-no-repeat border border-solid border-gray-300 bg-white cursor-pointer focus:outline-none"
		:aria-label="label"
		@change="handleChange($event)"
	>
		<option selected disabled>{{ label }}</option>
		<option
			v-for="variant in variants"
			:key="variant.node.id"
			:disabled="!variant.node.availableForSale"
			:value="variant.node.id"
		>
			{{ formatPrice(variant.node.priceV2.amount) }} - {{ variant.node.title }}
			{{ !variant.node.availableForSale ? " (Sold Out)" : "" }}
		</option>
	</select>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Ref } from "nuxt3/dist/app/compat/capi";
import { useProductStore } from "~/stores/product";
import { formatLocalePrice } from "~/utils/money";
import { useShopStore } from "~/stores/shop";

const props = defineProps<{
	label: string;
	variants: Ref;
	defaultVariant: string;
}>();

const { label, variants, defaultVariant } = toRefs(props);

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

const productStore = useProductStore();

const handleChange = (e: Event) => {
	const value = (e.target as HTMLSelectElement).value;
	productStore.setSelectedVariantId(value);
	emit("update:modelValue", value);
};

//Add Price to variant list
const shopStore = useShopStore();
const { localization } = storeToRefs(shopStore);
const currencyCode = localization.value?.country?.currency?.isoCode ?? "USD";

function formatPrice(price: number) {
	return formatLocalePrice(price, "en-US", currencyCode);
}

onMounted(() => {
	productStore.setSelectedVariantId(defaultVariant.value);
});
</script>
