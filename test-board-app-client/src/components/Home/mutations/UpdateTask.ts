import { gql } from "@apollo/client";

export const UPDATE_TASK = gql`
	mutation UpdateTask($id: ID!, $content: String!, $column_id: ID!, $created_at: Date!) {
		updateTask(id: $id, content: $content, column_id: $column_id, created_at: $created_at) {
			id
			content
			column_id
			created_at
		}
	}
`;
