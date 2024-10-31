import { Injectable } from '@angular/core';
import { User } from '../models/users.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersSubject$ = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject$.asObservable();

  setUsers(users: User[]) {
    this.usersSubject$.next(users);
  }

  editUser(editeduser: User) {
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

  createUser(user: User) {
    this.usersSubject$.next([user, ...this.usersSubject$.value]);
  }

  deleteUser(userId: number) {
    this.usersSubject$.next(
      this.usersSubject$.value.filter((user) => userId !== user.id)
    );
  }
}
