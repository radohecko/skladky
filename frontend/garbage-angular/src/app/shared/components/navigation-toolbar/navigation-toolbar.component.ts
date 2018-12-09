import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthDialogComponent, AuthService } from 'src/app/auth';

@Component({
  selector: 'app-navigation-toolbar',
  templateUrl: './navigation-toolbar.component.html',
  styleUrls: ['./navigation-toolbar.component.scss']
})
export class NavigationToolbarComponent implements OnInit {

  toggleMenu = false;

  constructor(private dialog: MatDialog, public authService: AuthService) { }

  ngOnInit() { }

  onOpenSignIn() {
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      disableClose: true,
      width: '400px',
      height: '300px'
    });
    this.onToggleMenu();
  }

  onOpenSignUp() {
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      disableClose: true,
      width: '400px',
      height: '300px',
      data: 'Sign Up'
    });
    this.onToggleMenu();
  }

  logOut() {
    this.authService.logOut();
    this.onToggleMenu();
  }

  onToggleMenu() {
    this.toggleMenu = !this.toggleMenu;
  }
}
