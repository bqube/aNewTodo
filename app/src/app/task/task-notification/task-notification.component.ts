import { Component, OnInit } from '@angular/core';
import { TaskService, TaskDataType } from '../task.service';

@Component({
	selector: 'app-task-notification',
	templateUrl: './task-notification.component.html',
	styleUrls: ['./task-notification.component.scss'],
})
export class TaskNotificationComponent implements OnInit {
	constructor(private taskService: TaskService) {}

	ngOnInit(): void {
		this.taskService.schedular.subscribe((scheduled) => {
			if (scheduled) {
				this.watchCompletion(scheduled);
			}
		});
	}

	watchCompletion(scheduled: Promise<TaskDataType>) {
		scheduled.then((task) => {
			// console.log(task);
			this.showAlert(`${task.title} time is over`);
		});
	}

	showAlert(msg: string) {
		alert(msg);
	}
}
