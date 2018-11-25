import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatRadioModule
} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  declarations: []
})
export class MaterialModule { }
