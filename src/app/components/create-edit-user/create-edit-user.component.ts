import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef, } from '@angular/material/dialog';
import { User } from '../../models/users.model';

interface UserFormControls {
  name: FormControl<string | null>;
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
}

interface UserForm {
  name: string;
  username: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-create-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MatDialogClose],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditUserComponent {
  public readonly dialogRef = inject(MatDialogRef<CreateEditUserComponent>);
  private readonly data = inject<{ isEdit: boolean; user?: User }>(
    MAT_DIALOG_DATA
  );
  public readonly isEdit: boolean = this.data.isEdit;

  public readonly form = new FormGroup<UserFormControls>({
    name: new FormControl<string | null>(
      this.data.user?.name || '',
      Validators.required
    ),
    username: new FormControl<string | null>(
      this.data.user?.username || '',
      Validators.required
    ),
    email: new FormControl<string | null>(this.data.user?.email || '', [
      Validators.required,
      Validators.email,
    ]),
    phone: new FormControl<string | null>(
      this.data.user?.phone || '',
      Validators.required
    ),
  });

  get userWithUpdateFields() {
    return {
      ...this.form.value,
      id: this.data.user?.id ?? new Date().getTime(),
    };
  }

  onCancel(): void {
    // Если окно в режиме редактирования, сбросьте форму к исходным данным
    if (this.isEdit && this.data.user) {
      this.form.setValue({
        name: this.data.user.name,
        username: this.data.user.username,
        email: this.data.user.email,
        phone: this.data.user.phone
      });
    } else {
      // Если не редактирование, сбрасываем форму в пустое состояние
      this.form.reset();
    }
    this.dialogRef.close();
  }

  public submitForm(): void {
    if (this.form.valid) {
      const userData = this.userWithUpdateFields;
      this.dialogRef.close(userData);
    }
  }
}