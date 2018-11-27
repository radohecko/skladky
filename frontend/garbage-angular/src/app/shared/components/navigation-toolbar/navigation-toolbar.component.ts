import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthDialogComponent, AuthService } from 'src/app/auth';

@Component({
  selector: 'app-navigation-toolbar',
  templateUrl: './navigation-toolbar.component.html',
  styleUrls: ['./navigation-toolbar.component.scss']
})
export class NavigationToolbarComponent implements OnInit, OnChanges {

  token = false;
  email: string;
  toggleMenu = false;

  constructor(private dialog: MatDialog, private authService: AuthService) { }

  ngOnInit() {
    console.log(this.authService.isAuthenticated());
    if (this.authService.isAuthenticated()) {
      this.token = true;
      this.email = this.authService.userEmail;
      console.log(this.email);
    }
  }

  ngOnChanges() {
    if (this.authService.isAuthenticated()) {
      this.token = true;
      this.email = this.authService.userEmail;
      console.log(this.email);
    }
  }

  onOpenSignIn() {
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      width: '400px',
      height: '300px'
    });
  }

  onOpenSignUp() {
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      width: '400px',
      height: '300px',
      data: 'Sign Up'
    });
  }

  logOut() {
    this.authService.logOut();
  }

  onToggleMenu() {
    this.toggleMenu = !this.toggleMenu;
  }
}
