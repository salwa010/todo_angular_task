export class Task {
  id!: number;
  title!: string;
  description!: string;
  currentStatus!: string;
  changeStatus!: boolean;
  checkboxDisabled: boolean = false;
}
