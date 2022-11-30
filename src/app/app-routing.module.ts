import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['document']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'document',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./pages/sign-in/sign-in.module').then((m) => m.SignInPageModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'document',
    loadChildren: () =>
      import('./pages/document/document.module').then(
        (m) => m.DocumentPageModule
      ),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./pages/user/user.module').then((m) => m.UserPageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
