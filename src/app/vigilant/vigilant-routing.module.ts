import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VigilantPage } from './vigilant.page';

const routes: Routes = [
  {
    path: '',
    component: VigilantPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: '',
        redirectTo: '/vigilant/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VigilantPageRoutingModule {}
