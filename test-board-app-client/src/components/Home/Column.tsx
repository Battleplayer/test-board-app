import React from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import Task from "./Task";
import { IColumn, ITask } from "../../interfaces/HomeData";
import useDeleteColumn from "./mutation_hooks/useDeleteColumn";

interface IColumnProps {
	column: IColumn;
	tasks: Array<ITask>;
	handleEdit: (id: string) => void;
	handleAdd: (type: string) => void;
	handleSelectColumn: (id: string) => void;
}

const Column = (props: IColumnProps) => {
	const { column, tasks = [], handleEdit, handleAdd, handleSelectColumn } = props;
	const deleteColumn = useDeleteColumn();
	const handleDeleteColumn = async () => {
		await deleteColumn(column.id);
	};

	const handleEditColumn = () => {
		handleSelectColumn(column.id);
	};
	return (
		<div className={"flex w-60 flex-col min-w-60 rounded"} style={{ backgroundColor: column.bg_color }}>
			<div className="flex items-center p-2 mb-1.5 justify-between gap-2">
				<h2 className="text-2xl font-semibold accent-gray-500 py-2">{column.title}</h2>
				<div className="flex flex-col gap-2 justify-between">
					<button onClick={handleEditColumn} className="p-2 bg-sky-600 text-white rounded">
						Edit
					</button>
					<button onClick={handleDeleteColumn} className="p-2 bg-red-700 text-white rounded">
						Delete
					</button>
				</div>
			</div>
			<hr />
			<Droppable droppableId={column?.id}>
				{(droppableProvided: DroppableProvided) => (
					<div
						className="p-1.5 flex flex-col h-full"
						ref={droppableProvided.innerRef}
						{...droppableProvided.droppableProps}>
						<>
							{tasks?.map((task, index) => <Task task={task} index={index} key={task.id} handleEdit={handleEdit} />)}
							<button
								onClick={() => handleAdd(column.id)}
								className="mt-auto w-full p-2 bg-sky-600 text-white font-bold rounded-s">
								Add
							</button>
						</>
						{droppableProvided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	);
};

export default Column;
