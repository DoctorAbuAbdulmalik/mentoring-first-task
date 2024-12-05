import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UsersApiService } from '../../services/users-api.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { UsersService } from '../../services/users.service';
import { CreateEditUserComponent } from '../create-edit-user/create-edit-user.component';
import { User } from '../../models/users.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [NgFor, UserCardComponent, AsyncPipe, MatTooltipModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  readonly usersApiService = inject(UsersApiService);
  readonly usersService = inject(UsersService);
  readonly dialog = inject(MatDialog);
  public readonly users$ = this.usersService.users$;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.initializeUsers();
  }

  editUser(editedUser: User): void {
    if (editedUser && editedUser.id) {
      this.usersService.editUser(editedUser);
    }
  }

  deleteUser(userId: number, name: string): void {
    const confirmed = window.confirm(
      `Вы действительно хотите удалить пользователя ${name}?`
    );
    if (confirmed) {
      this.usersService.deleteUser(userId);
    }
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      width: '30%',
      data: {isEdit: !!user, user},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (user) {
          this.editUser(result);
        } else {
          this.usersService.createUser(result);
        }
      }
    });
  }

  private initializeUsers(): void {
    const usersInLocalStorage = localStorage.getItem('users');

    if (!usersInLocalStorage || usersInLocalStorage === '[]') {
      // Если localStorage пустой, загружаем с бэкенда и сохраняем в localStorage
      // Здесь вызываем UsersApiService и его метод getUsers(). Подписываемся чтобы получить данные.
      // И эти данные передаем в метод setUsers() сервиса UsersService, которые мы кладем в usersSubject$
      this.usersApiService.getUsers()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((response: User[]) => {
        this.usersService.setUsers(response);
      });
    }
  }
}