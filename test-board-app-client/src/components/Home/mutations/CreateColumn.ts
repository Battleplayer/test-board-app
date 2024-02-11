import { gql } from "@apollo/client";

export const CREATE_COLUMN = gql`
	mutation CreateColumn($title: String!, $type: String!, $bg_color: String!) {
		createColumn(title: $title, bg_color: $bg_color, type: $type) {
			id
			title
			bg_color
			type
		}
	}
`;
