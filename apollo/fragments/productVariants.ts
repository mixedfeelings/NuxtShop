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
						url: url(transform: { maxWidth: 1200, maxHeight: 1200 })
						altText
						width
						height
						id
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
