import { Component, OnInit } from '@angular/core';
import { TaskService, TaskDataType } from '../task.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
	selector: 'app-task-list',
	templateUrl: './task-list.component.html',
	styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
	taskList: TaskDataType[];

	constructor(private readonly taskService: TaskService) {}

	ngOnInit(): void {
		this.taskService.taskList.subscribe((data: TaskDataType[]) => {
			console.log({ data });
			this.taskList = data.filter((task) => {
				if (!task.deleted) {
					return task;
				}
			});
		});
	}

	deleteTask(task: TaskDataType, position: number): void {
		task.deleted = true;
		this.taskService.updateTask(task, position);
	}

	taskStatusChanges(
		status: MatCheckboxChange,
		task: TaskDataType,
		position: number
	): void {
		task.isCompleted = status.checked;
		if (status.checked) {
			task.completedAt = new Date();
		} else {
			task.completedAt = null;
		}
		this.taskService.updateTask(task, position);
	}
}
