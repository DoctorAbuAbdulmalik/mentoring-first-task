import { User } from '../models/users.model';
import { createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';

export interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

export const userReducer = createReducer(
  initialState,
  on(UsersActions.set, (state, payload) => ({
    ...state,
    users: payload.users,
  })),
  on(UsersActions.edit, (state, payload) => ({
    ...state,
    users: state.users.map((user) => {
      if (user.id === payload.user.id) {
        return payload.user;
      } else {
        return user;
      }
      // return user.id === user.id ? user : user;
    })
  })),
  on(UsersActions.create, (state, payload) => ({
    ...state,
    users: [...state.users, payload.user],
  })),
  on(UsersActions.delete, (state, payload) => ({
    ...state,
    users: state.users.filter((user) => user.id !== payload.id),
  }))
);