import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectUsers } from '../../store/users.selectors';
import { Store } from '@ngrx/store';

import { UsersApiService } from '../../services/users-api.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { CreateEditUserComponent } from '../create-edit-user/create-edit-user.component';
import { User } from '../../models/users.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { UserActions } from '../../store/users.actions';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [NgFor, UserCardComponent, AsyncPipe, MatTooltipModule, JsonPipe],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  readonly usersApiService = inject(UsersApiService);
  readonly dialog = inject(MatDialog);
  readonly localStorageService = inject(LocalStorageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);
  public readonly users$ = this.store.select(selectUsers);

  constructor() {
    this.initializeUsers();
  }

  editUser(editedUser: User): void {
    if (editedUser && editedUser.id) {
      this.store.dispatch(UserActions.edit({editedUser}));
      this.updateLocalStorage();
    }
  }

  deleteUser(userId: number, name: string): void {
    const confirmed = window.confirm(
      `Вы действительно хотите удалить пользователя ${name}?`
    );
    if (confirmed) {
      this.store.dispatch(UserActions.delete({userId}));
      this.updateLocalStorage();
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
          this.store.dispatch(UserActions.create({user: result}));
          this.updateLocalStorage();
        }
      }
    });
  }

  private initializeUsers(): void {
    const usersInLocalStorage = this.localStorageService.getUser();

    if (!usersInLocalStorage || usersInLocalStorage.length === 0) {
      // Если localStorage пустой, загружаем с бэкенда и сохраняем в localStorage
      this.usersApiService.getUsers()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((response: User[]) => {
          this.store.dispatch(UserActions.set({users: response}));
          this.localStorageService.setUser(response);

        });
    } else {
      // Загружаем пользователей из localStorage, если они там есть
      this.store.dispatch(UserActions.set({users: usersInLocalStorage}));
    }
  }

  private updateLocalStorage(): void {
    // Обновляем localStorage, когда происходит изменение списка пользователей
    this.users$.subscribe((users) => {
      this.localStorageService.setUser(users);
    });
  }
}