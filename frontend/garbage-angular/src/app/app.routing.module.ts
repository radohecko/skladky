import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { DumpsComponent } from './core/dumps/dumps.component';
import { DumpListComponent } from './core/dumps/components/dump-list/dump-list.component';
import { DumpMapComponent } from './core/dumps/components/dump-map/dump-map.component';
import { StatsComponent } from './core/stats/stats.component';

const router: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'dumps', component: DumpsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: DumpListComponent
      },
      {
        path: 'map',
        component: DumpMapComponent
      }
    ]
  },
  {
    path: 'stats', component: StatsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(router)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
