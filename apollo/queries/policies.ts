import gql from "graphql-tag";

export const policies = gql`
	query Policies {
		shop {
			refundPolicy {
				title
				body
				url
			}
			shippingPolicy {
				title
				body
				url
			}
			termsOfService {
				title
				body
				url
			}
			privacyPolicy {
				title
				body
				url
			}
		}
	}
`;
