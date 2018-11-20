import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  token: string | null = null;

  constructor(private router: Router) {}

  // TODO: firestore login
  logIn(email: string, password: string) {}

  // TODO: firestore logout
  logOut() {
    this.token = null;
    window.location.href = '/';
}

  isAuthenticated() {
    return this.token !== null;
}

}
