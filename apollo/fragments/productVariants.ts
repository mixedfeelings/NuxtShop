import { gql } from "graphql-tag";

export const productVariants = gql`
	fragment productVariants on Product {
		variants(first: 100) {
			edges {
				cursor
				node {
					availableForSale
					id
					image {
						url: url(transform: { maxWidth: 160, maxHeight: 160 })
						altText
						width
						height
					}
					priceV2 {
						amount
						currencyCode
					}
					quantityAvailable
					selectedOptions {
						name
						value
					}
					sku
					title
				}
			}
		}
	}
`;
