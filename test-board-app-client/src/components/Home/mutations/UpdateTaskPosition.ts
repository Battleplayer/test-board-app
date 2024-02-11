import { gql } from "@apollo/client";

export const UPDATE_TASK_POSITION = gql`
	mutation UpdateTask($id: ID!, $column_id: ID!) {
		updateTask(id: $id, column_id: $column_id) {
			id
			column_id
		}
	}
`;
