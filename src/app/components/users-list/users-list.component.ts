import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { User } from '../../models/users.model';
import { UsersApiService } from '../../services/users-api.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [HeaderComponent, NgFor],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  readonly usersApiService = inject(UsersApiService);
  users: User[] = [];

  constructor() {
    this.usersApiService.getUsers().subscribe((response: any) => {
      this.users = response;
      console.log(response);
    });
  }

  deleteUser(id: number, name: string) {
    const confirmed = window.confirm(
      `Вы действительно хотите удалить пользователя ${name}?`
    );
    if (confirmed) {
      this.users = this.users.filter((user) => user.id !== id);
    }
  }
}
