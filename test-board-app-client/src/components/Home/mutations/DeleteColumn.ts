import { gql } from "@apollo/client";

export const DELETE_COLUMN = gql`
	mutation RemoveTask($id: ID!) {
		removeColumn(id: $id) {
			id
		}
	}
`;
