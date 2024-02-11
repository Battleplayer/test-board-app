import { gql } from "@apollo/client";

export const GET_ALL_COLUMNS = gql`
	query GetAllColumns {
		allColumns {
			title
			id
			type
			bg_color
		}
	}
`;
