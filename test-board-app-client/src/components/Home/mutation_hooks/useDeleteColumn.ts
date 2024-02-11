import { useMutation } from "@apollo/client";
import { GET_ALL_COLUMNS } from "../queries/GetAllColumns";
import { DELETE_COLUMN } from "../mutations/DeleteColumn";
import { IColumnsQueryResult } from "../../../interfaces/HomeData";

const useDeleteColumn = () => {
	const [deleteColumnMutation] = useMutation(DELETE_COLUMN, {
		update(cache, { data: { removeColumn } }) {
			const existingColumns = cache.readQuery<IColumnsQueryResult>({ query: GET_ALL_COLUMNS });
			if (existingColumns && removeColumn) {
				cache.writeQuery({
					query: GET_ALL_COLUMNS,
					data: {
						allColumns: existingColumns.allColumns.filter(column => column.id !== removeColumn.id),
					},
				});
			}
		},
	});

	return async (id: string) => {
		try {
			await deleteColumnMutation({ variables: { id } });
		} catch (e) {
			throw new Error("Deleting column failed");
		}
	};
};

export default useDeleteColumn;
