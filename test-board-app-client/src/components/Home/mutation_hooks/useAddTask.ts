import { useMutation } from "@apollo/client";
import { GET_ALL_TASKS } from "../queries/GetAllTasks";
import { CREATE_TASK } from "../mutations/CreateTask";
import { IGetAllTasksQueryResult, ITask } from "../../../interfaces/HomeData";

const useAddTask = () => {
	const [createTaskMutation] = useMutation(CREATE_TASK, {
		update: (cache, { data: { createTask } }) => {
			const existingTasksData = cache.readQuery<IGetAllTasksQueryResult>({ query: GET_ALL_TASKS });
			const updatedTasks = existingTasksData ? [...existingTasksData.allTasks, createTask] : [createTask];

			cache.writeQuery({
				query: GET_ALL_TASKS,
				data: { allTasks: updatedTasks },
			});
		},
		optimisticResponse: variables => ({
			__typename: "Mutation",
			createTask: {
				__typename: "Task",
				id: Date.now().toString(),
				...variables,
			},
		}),
	});

	return async (taskDetails: ITask) => {
		try {
			await createTaskMutation({ variables: taskDetails });
		} catch (e) {
			throw new Error("Creating task failed");
		}
	};
};

export default useAddTask;
