import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DumpsComponent } from './core/dumps/dumps.component';
import { DumpMapComponent } from './core/dumps/components/dump-map/dump-map.component';
import { DumpListComponent } from './core/dumps/components/dump-list/dump-list.component';
import { DumpDetailComponent } from './core/dumps/components/dump-detail/dump-detail.component';
import { HomeComponent } from './core/home/home.component';
import { DumpAddComponent } from './core/dumps/components/dump-add/dump-add.component';
import { StatsComponent } from './core/stats/stats.component';
import { AppRoutingModule } from './app.routing.module';
import { MaterialModule } from './material.module';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DumpsService } from './core/dumps/services/dumps.service';
import { NavigationToolbarComponent } from './shared/components/navigation-toolbar/navigation-toolbar.component';
import { FooterToolbarComponent } from './shared/components/footer-toolbar/footer-toolbar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthModule } from './auth';
import { DialogModule, DialogService } from './shared/components/dialog';
import { PageHeaderComponent } from './shared/components/page-header/page-header.component';
import { DumpEditComponent } from './core/dumps/components/dump-edit/dump-edit.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { GoogleMapComponent } from './shared/components/google-map/google-map.component';
import { ToggleButtonsComponent } from './shared/components/toggle-buttons/toggle-buttons.component';
import { DumpMapViewComponent } from './core/dumps/components/dump-map-view/dump-map-view.component';
import { NgMathPipesModule } from 'angular-pipes';
import { ImageDialogComponent } from './core/dumps/components/image-dialog/image-dialog.component';

@NgModule({
  declarations: [
    GoogleMapComponent,
    AppComponent,
    DumpsComponent,
    DumpMapComponent,
    DumpListComponent,
    DumpDetailComponent,
    HomeComponent,
    DumpAddComponent,
    StatsComponent,
    NavigationToolbarComponent,
    FooterToolbarComponent,
    PageHeaderComponent,
    DumpEditComponent,
    ToggleButtonsComponent,
    DumpMapViewComponent,
    ImageDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    DialogModule,
    NgMathPipesModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDVTT8btuhog4XIke6JG4wv38ABrf85qXc'})
  ],
  entryComponents: [
    DumpEditComponent,
    DumpAddComponent,
    ImageDialogComponent
  ],
  providers: [DumpsService, DialogService, GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
