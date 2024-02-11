import { useMutation } from "@apollo/client";
import { UPDATE_TASK_POSITION } from "../mutations/UpdateTaskPosition";
import { GET_ALL_TASKS } from "../queries/GetAllTasks";
import { IGetAllTasksQueryResult } from "../../../interfaces/HomeData";

const useUpdatePosition = () => {
	const [updateTaskMutation] = useMutation(UPDATE_TASK_POSITION, {
		optimisticResponse: variables => ({
			__typename: "Mutation",
			updateTask: {
				__typename: "Task",
				id: variables.id,
				column_id: variables.column_id,
			},
		}),
		update(cache, { data: { updateTask } }) {
			const existingTasksData = cache.readQuery<IGetAllTasksQueryResult>({ query: GET_ALL_TASKS });
			const existingTasks = existingTasksData?.allTasks;

			if (existingTasks) {
				const updatedTasks = existingTasks.map(task =>
					task.id === updateTask.id ? { ...task, column_id: updateTask.column_id } : task,
				);

				const sortedTasks = updatedTasks.sort((a, b) => {
					const createdAtA = new Date(a.created_at as string).getTime();
					const createdAtB = new Date(b.created_at as string).getTime();
					return createdAtA - createdAtB;
				});

				cache.writeQuery({
					query: GET_ALL_TASKS,
					data: { allTasks: sortedTasks },
				});
			}
		},
	});

	return async (taskId: string, column_id: string) => {
		try {
			await updateTaskMutation({
				variables: { id: taskId, column_id },
			});
		} catch (e) {
			throw new Error("Error updating task position:");
		}
	};
};

export default useUpdatePosition;
