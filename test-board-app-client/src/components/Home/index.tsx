import React, { useCallback, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Column from "./Column";
import CreateUpdateTaskModal from "./CreateUpdateTaskModal";
import { IColumnsQueryResult, ISelectedColumn, ISelectedTask, ITask } from "../../interfaces/HomeData";
import { useQuery } from "@apollo/client";
import { GET_ALL_TASKS } from "./queries/GetAllTasks";
import { GET_ALL_COLUMNS } from "./queries/GetAllColumns";
import useUpdatePosition from "./mutation_hooks/useUpdatePosition";
import CreateUpdateColumnModal from "./CreateUpdateColumnModal";

const Home = () => {
	const [selectedTask, setSelectedTask] = useState<ISelectedTask | null>(null);
	const [selectedColumn, setSelectedColumn] = useState<ISelectedColumn | null>(null);
	const { data, loading, error } = useQuery<{ allTasks: Array<ITask> }>(GET_ALL_TASKS);
	const {
		data: columns,
		loading: columnsLoading,
		error: columnsError,
	} = useQuery<IColumnsQueryResult>(GET_ALL_COLUMNS);

	const updatePosition = useUpdatePosition();
	const handleSelectColumn = useCallback(
		(id: string) => {
			const column = columns?.allColumns.find(c => c.id === id);
			if (!column) return;
			setSelectedColumn({ ...column, isNew: false });
		},
		[columns?.allColumns],
	);

	const handleEditTask = useCallback(
		(id: string) => {
			const task = data?.allTasks.find(el => el.id === id);
			if (!task) return;
			setSelectedTask({ ...task, isNew: false });
		},
		[data],
	);

	const handleAddTask = useCallback((id: string) => {
		const task = { id: Date.now().toString(), column_id: id, isNew: true };
		setSelectedTask(task);
	}, []);

	const handleCloseModal = useCallback(() => {
		setSelectedTask(null);
	}, []);

	const handleOpenColumnModal = useCallback(() => {
		setSelectedColumn({ id: "0", type: "", title: "", bg_color: "#cccf56", isNew: true });
	}, []);

	const handleCloseColumnModal = useCallback(() => {
		setSelectedColumn(null);
	}, []);

	const onDragEnd = async (result: DropResult) => {
		const { destination, source, draggableId } = result;
		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) {
			return;
		}
		try {
			await updatePosition(draggableId, destination.droppableId);
		} catch (e) {
			console.log(e);
		}
	};

	if (loading || columnsLoading) {
		return <h1>Loading...</h1>;
	}

	if (error || columnsError) {
		return <h1>{error?.message ?? columnsError?.message}</h1>;
	}

	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>
				<div className="container mx-auto px-4 flex pt-2 gap-4 items-start overflow-y-scroll min-h-screen">
					{columns?.allColumns.map(c => {
						const filteredTask = data?.allTasks.filter(t => t.column_id === c.id) ?? [];
						const columnDetails = {
							...c,
							taskIds: filteredTask.map(task => task.id),
							id: c.id,
						};
						return (
							<Column
								handleAdd={handleAddTask}
								handleEdit={handleEditTask}
								key={c.id}
								column={columnDetails}
								tasks={filteredTask}
								handleSelectColumn={handleSelectColumn}
							/>
						);
					})}
					<button className="p-10 bg-green-800 font-bold rounded text-white " onClick={handleOpenColumnModal}>
						Add a column
					</button>
				</div>
			</DragDropContext>
			<CreateUpdateTaskModal
				selectedTask={selectedTask}
				handleCloseModal={handleCloseModal}
				key={selectedTask?.id ?? "modal"}
			/>
			<CreateUpdateColumnModal
				key={selectedColumn?.id ?? "selectedcolumn"}
				selectedColumn={selectedColumn}
				handleCloseModal={handleCloseColumnModal}
			/>
		</>
	);
};

export default Home;
