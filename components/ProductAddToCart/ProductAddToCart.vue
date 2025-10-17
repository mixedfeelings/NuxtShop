<template>
	<button
		@click="addToCart"
		@keyup.enter="addToCart"
		:disabled="!selectedVariantId || disabled"
		class="add-to-cart-button p-4 disabled:opacity-50 disabled:cursor-not-allowed"
		:class="button_class"
	>
		<span>{{ label ? label : currentLabel }}</span>
	</button>
</template>

<script setup lang="ts">
import { useProductStore } from "~/stores/product";
import { useCartStore } from "~/stores/cart";

const props = defineProps<{
	label?: string;
	disabled?: boolean;
}>();

const { label } = toRefs(props);

const productStore = useProductStore();
const cartStore = useCartStore();

const labelActive = "Add to Cart";
const labelDisabled = "Make a selection";
const selectedVariantId = computed(() => productStore.selectedVariantId);
const currentLabel = computed(
	() =>
		//selectedVariantId.value ? labelActive : labelDisabled
		labelActive
);

const addToCart = () => {
	if (!selectedVariantId.value) {
		// TO-DO: Handle unselected variant
		return;
	}
	cartStore.cartLinesAdd(selectedVariantId.value);
	// productStore.setSelectedVariantId(selectedVariantId.value.id); //don't clear selected variant when adding to cart
};

const button_class = computed(() =>
	selectedVariantId.value === "" || props.disabled ? "disabled" : "not-disabled"
);
</script>

<style scoped>
button.not-disabled:hover {
	background-color: var(--global-color);
	color: var(--global-text-color);
}
</style>
