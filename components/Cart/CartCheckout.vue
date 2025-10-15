<template>
	<a v-if="checkoutUrl" :href="checkoutUrl" class="checkout-button py-4 w-full">
		Checkout
	</a>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
const cartStore = useCartStore();

const checkoutUrl = cartStore?.cart?.checkoutUrl;
</script>
