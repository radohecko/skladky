import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [
    AuthDialogComponent
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  entryComponents: [
    AuthDialogComponent,
  ],
  exports: [
    AuthDialogComponent
  ]
})
export class AuthModule { }

export * from './components/auth-dialog/auth-dialog.component';
export * from './auth.service';
