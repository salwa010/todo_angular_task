import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../model.ts/task';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  ServiceURL!: string;
  private idCounter = 1;
  constructor(private http: HttpClient) {
    this.ServiceURL = 'http://localhost:3000/tasks';
  }

  generateId() {
    return this.idCounter++;
  }
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.ServiceURL, task);
  }
  getAllTask(): Observable<Task[]> {
    return this.http.get<Task[]>(this.ServiceURL);
  }
  deleteTask(task: Task): Observable<Task> {
    return this.http.delete<Task>(this.ServiceURL + '/' + task.id);
  }
  editTask(task: Task): Observable<Task> {
    return this.http.put<Task>(this.ServiceURL + '/' + task.id, task);
  }
}
