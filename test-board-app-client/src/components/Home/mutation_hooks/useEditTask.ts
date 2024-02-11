import { useMutation } from "@apollo/client";
import { GET_ALL_TASKS } from "../queries/GetAllTasks";
import { UPDATE_TASK } from "../mutations/UpdateTask";
import { IGetAllTasksQueryResult, ITask } from "../../../interfaces/HomeData";

const useEditTask = () => {
	const [updateTaskMutation] = useMutation(UPDATE_TASK, {
		update: (cache, { data: { updateTask } }) => {
			const existingTasksData = cache.readQuery<IGetAllTasksQueryResult>({ query: GET_ALL_TASKS });

			const updatedTasks = existingTasksData?.allTasks.map(task =>
				task.id === updateTask.id ? { ...task, ...updateTask } : task,
			);

			cache.writeQuery({
				query: GET_ALL_TASKS,
				data: { allTasks: updatedTasks },
			});
		},
		optimisticResponse: ({ id, content, column_id, created_at }) => ({
			__typename: "Mutation",
			updateTask: {
				__typename: "Task",
				id,
				content,
				column_id,
				created_at,
			},
		}),
	});

	return async (taskDetails: ITask) => {
		try {
			await updateTaskMutation({ variables: taskDetails });
		} catch (e) {
			throw new Error("Updating task failed");
		}
	};
};

export default useEditTask;
