import { gql } from "@apollo/client";

export const DELETE_TASK = gql`
	mutation RemoveTask($id: ID!) {
		removeTask(id: $id) {
			id
		}
	}
`;
