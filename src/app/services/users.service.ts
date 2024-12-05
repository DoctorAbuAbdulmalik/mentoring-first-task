import { DestroyRef, inject, Injectable } from '@angular/core';
import { User } from '../models/users.model';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public readonly destroyRef = inject(DestroyRef);

  private readonly usersSubject$ = new BehaviorSubject<User[]>([]);
  public readonly users$ = this.usersSubject$.asObservable();
  private readonly localStorageKey = 'users';

  constructor() {
    this.loadUsersFromLocalStorage();
    this.users$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((users) => {
      this.saveUsersToLocalStorage(users);
    });
  }

  setUsers(users: User[]): void {
    this.usersSubject$.next(users);
    this.saveUsersToLocalStorage(users);
  }

  editUser(editedUser: User): void {
    const updatedUsers = this.usersSubject$.value.map((user) =>
      user.id === editedUser.id ? editedUser : user
    );
    this.usersSubject$.next(updatedUsers);
    this.saveUsersToLocalStorage(updatedUsers);
  }

  createUser(user: User): void {
    const existingUser = this.usersSubject$.value.find(
      (currentElement) => currentElement.email === user.email
    );

    // Если такой пользователь уже есть, то не добавляем
    if (existingUser) {
      alert('ТАКОЙ ПОЛЬЗОВАТЕЛЬ УЖЕ ЗАРЕГИСТРИРОВАН');
    }
    // Если такого пользователя нету, то добавляем
    else {
      const updatedUsers = [...this.usersSubject$.value, user];
      this.usersSubject$.next(updatedUsers);
      this.saveUsersToLocalStorage(updatedUsers);
      alert('НОВЫЙ ПОЛЬЗОВАТЕЛЬ УСПЕШНО ДОБАВЛЕН');
    }
  }

  deleteUser(userId: number): void {
    const updatedUsers = this.usersSubject$.value.filter(
      (user) => userId !== user.id
    );
    this.usersSubject$.next(updatedUsers);
    this.saveUsersToLocalStorage(updatedUsers);
  }

  // Загружаем пользователей из local storage
  private loadUsersFromLocalStorage(): void {
    const usersData = localStorage.getItem(this.localStorageKey);
    if (usersData) {
      const users = JSON.parse(usersData) as User[];
      this.usersSubject$.next(users);
    }
  }

  // Сохраняем пользователей в local storage
  private saveUsersToLocalStorage(users: User[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  }
}
