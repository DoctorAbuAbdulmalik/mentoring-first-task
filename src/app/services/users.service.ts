import { inject, Injectable } from '@angular/core';
import { User } from '../models/users.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly usersSubject$ = new BehaviorSubject<User[]>([]);
  public readonly users$ = this.usersSubject$.asObservable();

  setUsers(users: User[]): void {
    this.usersSubject$.next(users);
  }

  editUser(editeduser: User): void {
    this.usersSubject$.next(
      this.usersSubject$.value.map((user) => {
        if (user.id === editeduser.id) {
          return editeduser;
        } else {
          return user;
        }
      })
    );
  }

  createUser(user: User): void {
    const existingUser = this.usersSubject$.value.find(
      (currentElement) => currentElement.email === user.email
    );

    // Если такой пользователь уже есть, то не добавляем
    if (existingUser) {
      alert('ТАКОЙ EMAIL УЖЕ ЗАРЕГИСТРИРОВАН');
    }
    // Если такого пользователя нету, то добавляем
    else {
      this.usersSubject$.next([...this.usersSubject$.value, user]);
      alert('НОВЫЙ ПОЛЬЗОВАТЕЛЬ УСПЕШНО ДОБАВЛЕН');
    }
  }

  deleteUser(userId: number): void {
    this.usersSubject$.next(
      this.usersSubject$.value.filter((user) => userId !== user.id)
    );
  }
}
