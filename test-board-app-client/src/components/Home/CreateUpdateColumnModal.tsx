import { ChangeEvent, useMemo, useState } from "react";
import useCreateColumn from "./mutation_hooks/useCreateColumn";
import { ISelectedColumn } from "../../interfaces/HomeData";
import useUpdateColumn from "./mutations/UpdateColumn";

interface ICreateModalProps {
	handleCloseModal: () => void;
	selectedColumn: ISelectedColumn | null;
}

const CreateUpdateColumnModal = (props: ICreateModalProps) => {
	const { handleCloseModal, selectedColumn } = props;
	const [data, setData] = useState<ISelectedColumn>(
		selectedColumn ?? { id: "0", type: "", title: "", bg_color: "#cccf56", isNew: true },
	);
	const createColumn = useCreateColumn();
	const updateColumn = useUpdateColumn();

	const isValid = useMemo(() => {
		return !(!data.type.trim() || !data.title.trim());
	}, [data]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setData(prevState => ({ ...prevState, [name]: value }));
	};
	const handleClose = () => {
		handleCloseModal();
	};
	const handleSubmit = async () => {
		if (!data) return;
		try {
			if (selectedColumn?.isNew) {
				return await createColumn(data);
			}
			if (JSON.stringify(data) === JSON.stringify(selectedColumn)) {
				return;
			}
			await updateColumn(data);
		} catch (e) {
			console.log(e);
		} finally {
			handleClose();
		}
	};

	if (!selectedColumn) return null;

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
							<h3 className="text-3xl font-semibold">{selectedColumn.isNew ? "Create a column" : "Edit a column"}</h3>
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
						<div className="relative px-6 flex flex-col gap-4">
							<label>
								Title:
								<input className="w-full shadow-xl" value={data.title} name="title" onChange={e => handleChange(e)} />
							</label>
							<label>
								Type:
								<input className="w-full shadow-xl" value={data.type} name="type" onChange={e => handleChange(e)} />
							</label>
							<label>
								Background color:
								<input
									type="color"
									className="w-full shadow-xl"
									value={data.bg_color}
									name="bg_color"
									onChange={e => handleChange(e)}
								/>
							</label>
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
								onClick={handleClose}>
								Close
							</button>
							<button
								className="bg-emerald-500 text-white active:bg-emerald-600
										 font-bold uppercase text-sm px-6 py-3 rounded shadow
										 hover:shadow-lg outline-none focus:outline-none mr-1
										 disabled:bg-slate-50 disabled:text-slate-500
										  mb-1 ease-linear transition-all duration-150"
								type="button"
								disabled={!isValid}
								onClick={handleSubmit}>
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

export default CreateUpdateColumnModal;
