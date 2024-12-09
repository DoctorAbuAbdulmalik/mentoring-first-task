import { Injectable } from '@angular/core';
import { User } from '../models/users.model';

const LOCAL_STORAGE_KEY_USERS = 'users';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  public getUser(): User[] | null {
    const users: string | null = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
    return users ? JSON.parse(users) : null;
  }

  public setUser(users: User[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(users));
  }

  public removeUser(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY_USERS);
  }

  public clear() {
    localStorage.clear();
  }
}