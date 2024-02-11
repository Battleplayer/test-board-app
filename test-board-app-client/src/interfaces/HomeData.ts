interface ITask {
	id: string;
	content?: string;
	column_id: string;
	created_at?: string;
}

interface ISelectedTask extends ITask {
	isNew: boolean;
}
interface ISelectedColumn extends IColumnValue {
	isNew: boolean;
}
interface IColumnValue {
	id: string;
	title: string;
	bg_color: string;
	type: string;
}

interface IColumn extends IColumnValue {
	taskIds: Array<string>;
}

interface IGetAllTasksQueryResult {
	allTasks: Array<ITask>;
}

interface IColumnsQueryResult {
	allColumns: Array<IColumnValue>;
}

export type {
	ITask,
	IColumn,
	IColumnValue,
	ISelectedTask,
	IGetAllTasksQueryResult,
	IColumnsQueryResult,
	ISelectedColumn,
};
