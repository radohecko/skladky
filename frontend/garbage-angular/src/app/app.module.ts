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
import { MaterialModule } from './material.module';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DumpsService } from './core/dumps/services/dumps.service';
import { NavigationToolbarComponent } from './shared/components/navigation-toolbar/navigation-toolbar.component';
import { FooterToolbarComponent } from './shared/components/footer-toolbar/footer-toolbar.component';

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
    StatsComponent,
    NavigationToolbarComponent,
    FooterToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [DumpsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
