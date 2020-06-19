import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { CreateTaskComponent } from './create-task/create-task.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskComponent } from './task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from './task.service';
import { TaskNotificationComponent } from './task-notification/task-notification.component';
import { HttpClientModule } from '@angular/common/http';

const matModules = [
	MatIconModule,
	MatCheckboxModule,
	MatDividerModule,
	MatButtonModule,
];

@NgModule({
	declarations: [
		CreateTaskComponent,
		TaskListComponent,
		TaskComponent,
		TaskNotificationComponent,
	],
	imports: [
		CommonModule,
		HttpClientModule,
		TaskRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		...matModules,
	],
	providers: [TaskService],
})
export class TaskModule {}
