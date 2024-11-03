import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { UsersApiService } from '../../services/users-api.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { UsersService } from '../../services/users.service';
import { CreateEditUserComponent } from '../create-edit-user/create-edit-user.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    HeaderComponent,
    NgFor,
    UserCardComponent,
    AsyncPipe,
    CreateEditUserComponent,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  readonly usersApiService = inject(UsersApiService);
  readonly usersService = inject(UsersService);

  public readonly users$ = this.usersService.users$;

  constructor() {
    //здесь вызываем UsersApiService и его метод getUsers(). Подписываемся чтобы получить данные.
    //И эти данные передаем в метод setUsers() сервиса UsersService, которые мы кладем в usersSubject$
    this.usersApiService.getUsers().subscribe((response: any) => {
      this.usersService.setUsers(response);
    });

    this.usersService.users$.subscribe((users) => console.log(users));
  }

  //formData это данные которые приходят с отправленной формы компонета CreateEditUserComponent
  public createUser(formData: any) {
    this.usersService.createUser({
      id: new Date().getTime(),
      name: formData.name, //formControlName="name"
      username: formData.userName, //formControlName="userName"
      email: formData.email, //formControlName="email"
      phone: formData.phone, //formControlName="phone"
    });
    console.log('Данные: ', formData);
  }

  deleteUser(userId: number, name: string) {
    const confirmed = window.confirm(
      `Вы действительно хотите удалить пользователя ${name}?`
    );
    if (confirmed) {
      this.usersService.deleteUser(userId);
    }
  }
}
