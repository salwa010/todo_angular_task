import { Component, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterOutlet } from '@angular/router';
import { Task } from './model.ts/task';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from './new-task/new-task.component';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
} from '@angular/material/dialog';
import { CrudService } from './service/crud.service';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from './shared/shared/confirm-dialog/confirm-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatCheckboxModule,
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Todo_task';
  taskArr: Task[] = [];
  filteredTasks: any[] = [];
  private STORAGE_KEY = 'todo_tasks';
  selectedTab = 0;
  constructor(
    private dialog: MatDialog,
    private crudService: CrudService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadFromStorage();
    this.applyFilter();
  }
  saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.taskArr));
  }

  loadFromStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    this.taskArr = data ? JSON.parse(data) : [];
  }
  loadTasks() {
    this.http.get<Task[]>('assets/dummy.json').subscribe((data) => {
      this.taskArr = data;
      console.log(data);
    });
  }
  applyFilter() {
    if (this.selectedTab === 1) {
      // Completed
      this.filteredTasks = this.taskArr.filter(
        (t) => t.currentStatus === 'Completed'
      );
    } else if (this.selectedTab === 2) {
      // Pending
      this.filteredTasks = this.taskArr.filter(
        (t) => t.currentStatus === 'Pending'
      );
    } else {
      // All
      this.filteredTasks = this.taskArr;
    }
  }

  toggleStatus(task: Task): void {
    task.changeStatus = !task.changeStatus;
    task.currentStatus = task.changeStatus ? 'Completed' : 'Pending';
    this.saveToStorage();
    this.applyFilter();
  }
  onCheckboxChange(event: any, task: Task) {
    if (task.currentStatus === 'Completed') {
      event.source.checked = true;
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        task.currentStatus = 'Completed';
        task.changeStatus = true;
        task.checkboxDisabled = true;
        this.applyFilter();
      } else {
        // 👇 revert checkbox when NO is clicked
        event.source.checked = false;
        task.changeStatus = false;
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // assign a client-side id if backend didn't provide one
        const maxId = this.taskArr.reduce(
          (max, t) => Math.max(max, t.id || 0),
          0
        );
        result.id = result.id || maxId + 1;
        this.taskArr.push(result);
        this.saveToStorage();
        this.applyFilter();
      }
    });
  }
  deleteTask(id: number) {
    this.taskArr = this.taskArr.filter((task) => task.id !== id);
    this.applyFilter();
    this.saveToStorage();
  }
}
