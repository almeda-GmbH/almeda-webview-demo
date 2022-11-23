import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppointmentIFramePage } from './appointment-iframe/appointment-iframe.component';
import { HomePage } from './home/home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'appointment-iframe',
    component: AppointmentIFramePage
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
