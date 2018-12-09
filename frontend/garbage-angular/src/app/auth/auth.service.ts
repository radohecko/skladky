import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthService {

  token: string | null = null;
  userEmail: string;

  constructor(private router: Router, private afAuth: AngularFireAuth, private snackBar: MatSnackBar) { }

  signIn(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        this.afAuth.auth.currentUser.getIdToken()
          .then(
            (token: string) => {
              this.token = token;
              this.userEmail = email;
            });
            this.toastMessage('Login successful!');
      })
      .catch(
        Error => {
          if (Error.code === 'auth/wrong-password') {
            console.log('Wrong password');
          } else {
            console.log(Error);
          }
          this.toastMessage('Login attempt failed!');
        }
      );
  }

  signUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.signIn(email, password);
      })
      .catch(Error => {
        this.toastMessage('Signup attempt failed!');
        console.log(Error);
      });
  }

  logOut() {
    this.token = null;
    this.afAuth.auth.signOut();
    this.router.navigate(['/home']);
  }

  isAuthenticated() {
    return this.token !== null;
  }

  getUserEmail() {
    if (this.token) {
      return this.userEmail;
    }
  }

  toastMessage(message: string) {
    this.snackBar.open(message, null, {
      duration: 3000,
    });
  }

}
