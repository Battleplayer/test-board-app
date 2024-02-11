import { gql } from "@apollo/client";

export const GET_ALL_TASKS = gql`
	query GetAllTasks {
		allTasks {
			id
			content
			column_id
			created_at
		}
	}
`;
