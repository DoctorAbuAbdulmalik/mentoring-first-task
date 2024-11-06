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

interface UserFormControls {
  name: FormControl<string | null>;
  userName: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
}

interface UserForm {
  name: string;
  userName: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-create-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditUserComponent {
  @Output() createUser = new EventEmitter<UserForm>();

  public readonly form = new FormGroup<UserFormControls>({
    name: new FormControl<string | null>('', Validators.required),
    userName: new FormControl<string | null>('', Validators.required),
    email: new FormControl<string | null>('', [
      Validators.required,
      Validators.email,
    ]),
    phone: new FormControl<string | null>('', Validators.required),
  });

  isEdit!: boolean;

  public submitForm(): void {
    if (this.form.valid) {
      this.createUser.emit(this.form.getRawValue() as UserForm);
      this.form.reset();
    }
  }
}
