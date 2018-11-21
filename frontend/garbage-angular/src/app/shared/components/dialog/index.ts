import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogActionsComponent } from './dialog-actions/dialog-actions.component';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { DialogTitleComponent } from './dialog-title/dialog-title.component';
import { ConfirmDialogComponent } from './common-dialogs/confirm-dialog/confirm-dialog.component';
import { DialogService } from './dialog.service';
import { MatIconModule, MatDialogModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [
    DialogTitleComponent,
    DialogContentComponent,
    DialogActionsComponent,
    ConfirmDialogComponent,
  ],
  providers: [
    DialogService
  ],
  entryComponents: [
    ConfirmDialogComponent,
  ],
  exports: [
    DialogTitleComponent,
    DialogContentComponent,
    DialogActionsComponent,
    ConfirmDialogComponent,
  ]
})
export class DialogModule {
}

export * from './dialog-actions/dialog-actions.component';
export * from './dialog-content/dialog-content.component';
export * from './dialog.service';
export * from './dialog-title/dialog-title.component';
