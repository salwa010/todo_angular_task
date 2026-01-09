import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CrudService } from '../service/crud.service';
@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogContent,
    MatDialogActions,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent {
  formData: FormGroup;
  constructor(
    private fb: FormBuilder,
    private crud: CrudService,
    private dialogRef: MatDialogRef<NewTaskComponent>
  ) {
    this.formData = this.fb.group({
      id: [],
      title: ['', Validators.required],
      description: [''],
      changeStatus: [false],
      currentStatus: ['pending'],
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  submit() {
    console.log(this.formData.value);
    if (this.formData.invalid) return;
    const newTask = {
      id: this.crud.generateId(),
      title: this.formData.value.title!,
      description: this.formData.value.description!,
      currentStatus: 'Pending',
      changeStatus: false,
    };

    this.dialogRef.close(newTask);
  }
}
