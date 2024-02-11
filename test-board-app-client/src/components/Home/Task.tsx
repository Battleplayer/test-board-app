import { Draggable, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import React from "react";
import { ITask } from "../../interfaces/HomeData";
import useDeleteTask from "./mutation_hooks/useDeleteTask";

interface Props {
	task: ITask;
	handleEdit: (id: string) => void;
	index: number;
}

const humanizeDate = (date: string): string => {
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	};
	const formattedDate = new Date(date);
	return new Intl.DateTimeFormat("uk-UA", options).format(formattedDate);
};
const Task = (props: Props) => {
	const { task, index, handleEdit } = props;
	const deleteTask = useDeleteTask();
	return (
		<Draggable shouldRespectForcePress={true} key={task.id} draggableId={`${task.id}`} index={index}>
			{(draggableProvided: DraggableProvided, draggableSnapshot: DraggableStateSnapshot) => {
				const outlineColor = draggableSnapshot.isDragging ? "card-border" : "transparent";
				const boxShadow = draggableSnapshot.isDragging ? "0 5px 10px rgba(0, 0, 0, 0.6)" : "unset";
				return (
					<div
						className={`flex flex-col gap-2 mb-3 p-2.5 shadow-2xl outline-1 bg-green-300 ${outlineColor} ${boxShadow}`}
						ref={draggableProvided.innerRef}
						{...draggableProvided.draggableProps}
						{...draggableProvided.dragHandleProps}>
						<p className="text-xl">{task.content}</p>
						<div className="my-2">
							<p className="text-sm">Created at:</p>
							<p className="text-sm">{humanizeDate(task.created_at ?? "")}</p>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => handleEdit(task.id)}
								className="w-full p-2 bg-purple-600 text-white font-semibold rounded-md">
								Edit
							</button>
							<button
								onClick={() => deleteTask(task.id)}
								className="w-full p-2 bg-red-500 text-white font-semibold rounded-md">
								Remove
							</button>
						</div>
					</div>
				);
			}}
		</Draggable>
	);
};

export default Task;
