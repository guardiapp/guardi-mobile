import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../pages/home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('../pages/notifications/notifications.module'),
      },
      {
        path: 'visitors',
        loadChildren: () =>
          import('../pages/visitors/visitors.module').then(
            (m) => m.VisitorsPageModule
          ),
      },

      {
        path: 'reservations',
        loadChildren: () =>
          import('../pages/reservations/reservations.module').then(
            (m) => m.ReservationsPageModule
          ),
      },
      {
        path: 'create-reservation',
        loadChildren: () =>
          import('../pages/create-reservation/create-reservation.module').then(
            (m) => m.CreateReservationPageModule
          ),
      },
      {
        path: 'create-service-reservation',
        loadChildren: () =>
          import(
            '../pages/create-service-reservation/create-service-reservation.module'
          ).then((m) => m.CreateServiceReservationPageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../pages/profile/profile.module').then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
