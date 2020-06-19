import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, TimeInterval } from 'rxjs';
import { isAfter, isBefore } from 'date-fns';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface TaskDataType {
	id?: number;
	title: string;
	dueDateTime: Date;
	isCompleted: boolean;
	completedAt: Date;
	deleted?: boolean;
}

export interface NewTaskDataType {
	title: string;
	dueDateTime: Date;
}

interface TodoAPIDataType {
	id?: number;
	title: string;
	due_date_time: Date;
	is_completed?: boolean;
	completed_at?: Date;
	deleted?: boolean;
}

const API_ENDPOINT = `${environment.API_URL}/todo`;

@Injectable()
export class TaskService {
	taskList = new BehaviorSubject<TaskDataType[]>([]);
	schedular = new BehaviorSubject<Promise<TaskDataType>>(null);
	private _taskList: TaskDataType[] = [];
	constructor(private http: HttpClient) {
		this.getTaskList().subscribe((data) => {
			this._taskList = this.processAPIResponse(data);
			this._taskList.forEach((task) => {
				if (isBefore(new Date(), task.dueDateTime)) {
					this.schedular.next(this.getSchedular(task));
				}
			});
			this.taskList.next(this._taskList);
		});
	}

	getTaskList() {
		return this.http.get(`${API_ENDPOINT}/`).pipe(
			map((data: TodoAPIDataType[]) => {
				return data;
			}),
			catchError((error) => {
				return throwError('Unable to fetch task list');
			})
		);
	}

	addTask(task: NewTaskDataType): void {
		// const isCompleted = false;
		// const completedAt = null;
		// const newTask: TaskDataType = { ...task, isCompleted, completedAt };
		// this._taskList.push(newTask);
		// this.taskList.next(this._taskList);
		this.saveTaskToDB(task).subscribe((resp) => {
			const newTask: TaskDataType = {
				id: resp.id,
				title: resp.title,
				dueDateTime: new Date(resp.due_date_time),
				isCompleted: resp.is_completed,
				deleted: resp.deleted,
				completedAt: resp.completed_at
					? new Date(resp.completed_at)
					: null,
			};
			this._taskList.push(newTask);
			this.taskList.next(this._taskList);
			this.schedular.next(this.getSchedular(newTask));
		});
	}

	saveTaskToDB(task: NewTaskDataType) {
		const data: TodoAPIDataType = {
			title: task.title,
			due_date_time: task.dueDateTime,
		};
		return this.http.post<TodoAPIDataType>(`${API_ENDPOINT}/`, data);
	}

	updateTask(task: TaskDataType, position: number): void {
		if ('id' in task) {
			this.updateTaskToDB(task, task.id).subscribe((resp) => {
				this._taskList[position] = task;
				this.taskList.next(this._taskList);
			});
		}
	}

	updateTaskToDB(task: TaskDataType, id: number) {
		const data: TodoAPIDataType = {
			title: task.title,
			due_date_time: task.dueDateTime,
			is_completed: task.isCompleted,
			deleted: task.deleted,
			completed_at: task.completedAt,
		};
		return this.http.put<TodoAPIDataType>(`${API_ENDPOINT}/${id}/`, data);
	}

	private processAPIResponse(data: TodoAPIDataType[]): TaskDataType[] {
		return data.reduce((acc, c) => {
			const mappeddata: TaskDataType = {
				id: c.id,
				title: c.title,
				dueDateTime: new Date(c.due_date_time),
				isCompleted: c.is_completed,
				deleted: c.deleted,
				completedAt: c.completed_at ? new Date(c.completed_at) : null,
			};
			acc.push(mappeddata);
			return acc;
		}, []);
	}

	private getSchedular(task: TaskDataType): Promise<TaskDataType> {
		return new Promise((res, rej) => {
			if (isBefore(new Date(), task.dueDateTime)) {
				const interval = setInterval(() => {
					if (isAfter(new Date(), task.dueDateTime)) {
						this.stopLoader(task, interval);
						res(task);
					}
				}, 1000);
			}
		});
	}

	private stopLoader(task: TaskDataType, interval) {
		clearInterval(interval);
	}

	// private updateTaskList(newTask: TaskDataType): void {
	// 	// TODO:: Add backend call to insert new task
	// 	this.taskList.next(this._taskList);
	// }
}
