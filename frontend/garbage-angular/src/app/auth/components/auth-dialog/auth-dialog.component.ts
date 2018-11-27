import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ErrorStateMatcher } from '../../auth.matcher';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {

  form: FormGroup;
  title = 'Sign In';
  matcher = new ErrorStateMatcher();

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialogRef: MatDialogRef<AuthDialogComponent>,
    private fb: FormBuilder,
    private authService: AuthService) { }

  ngOnInit() {
    if (this.data) {
      this.title = this.data;
    }
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.data === 'Sign Up') {
      this.authService.signUp(this.email.value, this.password.value);
      console.log('1');
    } else {
      this.authService.signIn(this.email.value, this.password.value);
      console.log('2');
    }
    this.onClose();
  }

  onClose() {
    this.dialogRef.close();
  }

}
