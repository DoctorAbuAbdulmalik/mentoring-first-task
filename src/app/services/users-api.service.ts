import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class UsersApiService {
  readonly apiService = inject(HttpClient);
  private readonly apiUrl: string = 'https://jsonplaceholder.typicode.com/users';

  getUsers() {
    return this.apiService.get(this.apiUrl);
  }
}
