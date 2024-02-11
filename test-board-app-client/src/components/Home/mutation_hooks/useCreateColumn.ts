import { CREATE_COLUMN } from "../mutations/CreateColumn";
import { useMutation } from "@apollo/client";
import { GET_ALL_COLUMNS } from "../queries/GetAllColumns";
import { IColumnsQueryResult } from "../../../interfaces/HomeData";

interface ICreateColumnArgs {
	title: string;
	bg_color: string;
	type: string;
}
const useCreateColumn = () => {
	const [createColumnMutation] = useMutation(CREATE_COLUMN, {
		update(cache, { data: { createColumn } }) {
			const existingColumns = cache.readQuery<IColumnsQueryResult>({ query: GET_ALL_COLUMNS });
			const newColumns = existingColumns ? [...existingColumns.allColumns, createColumn] : [createColumn];

			cache.writeQuery({
				query: GET_ALL_COLUMNS,
				data: { allColumns: newColumns },
			});
		},
	});

	return async ({ title, bg_color, type }: ICreateColumnArgs) => {
		try {
			await createColumnMutation({ variables: { title, bg_color, type } });
		} catch (e) {
			throw new Error("Creating column failed");
		}
	};
};

export default useCreateColumn;
