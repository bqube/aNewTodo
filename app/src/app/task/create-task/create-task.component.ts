import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { TaskService, NewTaskDataType } from '../task.service';
import { add } from 'date-fns';

@Component({
	selector: 'app-create-task',
	templateUrl: './create-task.component.html',
	styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit {
	hint = 'Add a task';
	taskTitle = new FormControl(null, [Validators.required]);
	hours = new FormControl(0, [Validators.required]);
	minutes = new FormControl(30, [Validators.required]);
	private _placeholder: string;
	constructor(private readonly taskService: TaskService) {}

	ngOnInit(): void {
		this._placeholder = this.hint;
	}

	addTask(): void {
		if (!this.taskTitle.valid) {
			this._placeholder = 'Write a task';
			return null;
		}
		const newTask: NewTaskDataType = {
			title: this.taskTitle.value,
			dueDateTime: add(new Date(), {
				hours: this.hours.value,
				minutes: this.minutes.value,
			}),
		};
		this.taskService.addTask(newTask);
		this.taskTitle.reset();
	}

	set placeholder(value: string) {
		this._placeholder = value;
	}

	get placeholder(): string {
		return this._placeholder;
	}
}
