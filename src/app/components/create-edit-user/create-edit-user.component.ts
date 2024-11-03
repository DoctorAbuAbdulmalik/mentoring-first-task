import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditUserComponent {
  @Output() createUser = new EventEmitter();

  public form = new FormGroup({
    name: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
  });

  isEdit!: boolean;

  public submitForm(): void {
    if (this.form.valid) {
      this.createUser.emit(this.form.value);
      this.form.reset();
    }
  }
}
