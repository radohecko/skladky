import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DumpsComponent } from './core/dumps/dumps.component';
import { DumpMapComponent } from './core/dumps/components/dump-map/dump-map.component';
import { DumpListComponent } from './core/dumps/components/dump-list/dump-list.component';
import { DumpDetailComponent } from './core/dumps/components/dump-detail/dump-detail.component';
import { AuthDialogComponent } from './auth/components/auth-dialog/auth-dialog.component';
import { HomeComponent } from './core/home/home.component';
import { DumpAddComponent } from './core/dumps/components/dump-add/dump-add.component';
import { StatsComponent } from './core/stats/stats.component';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DumpsComponent,
    DumpMapComponent,
    DumpListComponent,
    DumpDetailComponent,
    AuthDialogComponent,
    HomeComponent,
    DumpAddComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
