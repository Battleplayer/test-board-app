import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
	mutation CreateTask($content: String!, $column_id: ID!, $created_at: Date!) {
		createTask(content: $content, column_id: $column_id, created_at: $created_at) {
			id
			content
			column_id
			created_at
		}
	}
`;
