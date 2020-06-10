import { Component, OnInit } from '@angular/core';
import { TaskService, TaskDataType } from '../task.service';

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
		console.log(task, position);
		task.deleted = true;
		this.taskService.updateTask(task, position);
	}
}
