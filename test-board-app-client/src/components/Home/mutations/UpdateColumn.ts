import { useMutation } from "@apollo/client";
import { GET_ALL_COLUMNS } from "../queries/GetAllColumns";
import { UPDATE_COLUMN } from "../mutation_hooks/useUpdateColumn";
import { IColumnsQueryResult, IColumnValue } from "../../../interfaces/HomeData";

const useUpdateColumn = () => {
	const [updateColumnMutation] = useMutation(UPDATE_COLUMN, {
		update(cache, { data: { updateColumn } }) {
			const existingColumnsData = cache.readQuery<IColumnsQueryResult>({ query: GET_ALL_COLUMNS });
			const newColumns = existingColumnsData?.allColumns.map(col => {
				return col.id === updateColumn.id ? { ...col, ...updateColumn } : col;
			});

			cache.writeQuery({
				query: GET_ALL_COLUMNS,
				data: { allColumns: newColumns },
			});
		},
		optimisticResponse: ({ id, title, bg_color, type }) => ({
			__typename: "Mutation",
			updateColumn: {
				__typename: "Column",
				id,
				title,
				bg_color,
				type,
			},
		}),
	});

	return async ({ id, title, bg_color, type }: IColumnValue) => {
		try {
			await updateColumnMutation({
				variables: { id, title, bg_color, type },
			});
		} catch (e) {
			throw new Error("Error updating column:");
		}
	};
};

export default useUpdateColumn;
