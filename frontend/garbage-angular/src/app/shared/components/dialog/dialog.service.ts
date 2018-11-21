import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';
import { ConfirmDialogComponent } from './common-dialogs/confirm-dialog/confirm-dialog.component';


@Injectable()
export class DialogService extends MatDialog {
  /**
   * {string} confirmText
   * {boolean} onlyPositive = true - indicates whether only positive feedback is key
   */
  confirm(confirmText: string, onlyPositive = true) {
    const dialogRef = this.open(ConfirmDialogComponent, {
      width: '400px'
    });
    dialogRef.componentInstance.text = confirmText;
    return dialogRef.afterClosed().pipe(filter((isConfirmed: boolean) => (onlyPositive ? isConfirmed : true)));
  }

}
