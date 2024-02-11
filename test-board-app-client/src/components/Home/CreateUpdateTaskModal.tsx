import { useState } from "react";
import { ISelectedTask } from "../../interfaces/HomeData";
import useAddTask from "./mutation_hooks/useAddTask";
import useEditTask from "./mutation_hooks/useEditTask";

interface IModalProps {
	selectedTask: ISelectedTask | null;
	handleCloseModal: () => void;
}

const CreateUpdateTaskModal = (props: IModalProps) => {
	const { selectedTask, handleCloseModal } = props;
	const [content, setContent] = useState(selectedTask?.content ?? "");
	const editTask = useEditTask();
	const addTask = useAddTask();

	if (!selectedTask) return null;

	const handleSaveModal = async () => {
		const data = {
			...selectedTask,
			created_at: selectedTask?.isNew ? new Date().toISOString() : selectedTask.created_at,
			content,
		};
		try {
			if (selectedTask?.isNew) {
				await addTask(data);
			} else {
				if (JSON.stringify(data) === JSON.stringify(selectedTask)) {
					return;
				}
				await editTask(data);
			}
		} catch (e) {
			console.log(e);
		} finally {
			handleCloseModal();
		}
	};

	return (
		<>
			<div
				className="justify-center items-center flex overflow-x-hidden
						overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="relative w-auto my-6 mx-auto max-w-3xl">
					{/*content*/}
					<div
						className="border-0 rounded-lg shadow-lg relative flex
								flex-col w-full bg-white outline-none focus:outline-none">
						{/*header*/}
						<div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
							<h3 className="text-3xl font-semibold">{selectedTask.isNew ? "Create a card" : "Edit a card"}</h3>
							<button
								className="p-1 ml-auto bg-transparent border-0
											text-black opacity-5 float-right text-3xl leading-none
											font-semibold outline-none focus:outline-none"
								onClick={handleCloseModal}>
								<span
									className="bg-transparent text-black opacity-5 h-6
											w-6 text-2xl block outline-none focus:outline-none">
									×
								</span>
							</button>
						</div>
						{/*body*/}
						<div className="relative px-6 flex-auto">
							<textarea
								autoFocus
								className="min-h-24 w-full shadow-xl"
								value={content}
								onChange={e => setContent(e.target.value)}
							/>
						</div>
						{/*footer*/}
						<div
							className="flex items-center justify-end p-6 border-t
								border-solid border-blueGray-200 rounded-b">
							<button
								className="text-red-500 background-transparent font-bold
										 uppercase px-6 py-2 text-sm outline-none
										 focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button"
								onClick={handleCloseModal}>
								Close
							</button>
							<button
								className="bg-emerald-500 text-white active:bg-emerald-600
										 font-bold uppercase text-sm px-6 py-3 rounded shadow
										 hover:shadow-lg outline-none focus:outline-none mr-1
										 disabled:bg-slate-50 disabled:text-slate-500
										  mb-1 ease-linear transition-all duration-150"
								type="button"
								disabled={!content.trim().length}
								onClick={handleSaveModal}>
								Save Changes
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
		</>
	);
};
export default CreateUpdateTaskModal;
