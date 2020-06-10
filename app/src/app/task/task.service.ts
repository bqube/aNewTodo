import { Injectable } from '@angular/core';
import { BehaviorSubject, TimeInterval } from 'rxjs';
import { isEqual, isAfter, isBefore } from 'date-fns';

export interface TaskDataType {
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

@Injectable()
export class TaskService {
	taskList = new BehaviorSubject<TaskDataType[]>([]);
	schedular = new BehaviorSubject<Promise<TaskDataType>>(null);
	private _taskList: TaskDataType[] = [];
	constructor() {}

	addTask(task: NewTaskDataType): void {
		const isCompleted = false;
		const completedAt = null;
		const newTask: TaskDataType = { ...task, isCompleted, completedAt };
		this._taskList.push(newTask);
		this.taskList.next(this._taskList);
		// this.updateTaskList(newTask);

		this.schedular.next(this.getSchedular(newTask));
	}

	updateTask(task: TaskDataType, position: number): void {
		this._taskList[position] = task;
		this.taskList.next(this._taskList);
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
