import { Routes } from '@angular/router';
import { SocialLayoutComponent } from './layouts/social-layout/social-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('../features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'social',
    component: SocialLayoutComponent,
    loadChildren: () =>
      import('../features/social/social.routes').then((m) => m.socialRoutes),
  },
  { path: '**', redirectTo: 'auth/login' },
];
