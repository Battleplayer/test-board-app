import { gql } from "@apollo/client";

export const UPDATE_COLUMN = gql`
	mutation UpdateColumn($id: ID!, $title: String, $bg_color: String, $type: String) {
		updateColumn(id: $id, title: $title, bg_color: $bg_color, type: $type) {
			id
			title
			bg_color
			type
		}
	}
`;
