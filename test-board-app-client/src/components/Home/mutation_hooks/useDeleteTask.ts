import { useMutation } from "@apollo/client";
import { GET_ALL_TASKS } from "../queries/GetAllTasks";
import { DELETE_TASK } from "../mutations/DeleteTask";
import { IGetAllTasksQueryResult } from "../../../interfaces/HomeData";

const useDeleteTask = () => {
	const [deleteTaskMutation] = useMutation(DELETE_TASK, {
		update(cache, { data }) {
			if (data?.removeTask) {
				const existingTasksData = cache.readQuery<IGetAllTasksQueryResult>({ query: GET_ALL_TASKS });

				if (existingTasksData) {
					const updatedTasks = existingTasksData.allTasks.filter(task => task.id !== data.removeTask.id);

					cache.writeQuery({
						query: GET_ALL_TASKS,
						data: { allTasks: updatedTasks },
					});
				}
			}
		},
		optimisticResponse: ({ id }) => ({
			__typename: "Mutation",
			removeTask: { __typename: "Task", id },
		}),
	});

	return async (id: string) => {
		try {
			await deleteTaskMutation({ variables: { id } });
		} catch (e) {
			throw new Error("Deleting task failed");
		}
	};
};

export default useDeleteTask;
