import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { loggedGuard } from './shared/guards/logged.guard';
import { residentGuard } from './shared/guards/resident.guard';
import { vigilantGuard } from './shared/guards/vigilant.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),

    canActivate: [loggedGuard],
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [authGuard, residentGuard],
  },

  {
    path: 'vigilant',
    loadChildren: () =>
      import('./vigilant/vigilant.module').then((m) => m.VigilantPageModule),
    canActivate: [vigilantGuard],
  },
  {
    path: '**',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
