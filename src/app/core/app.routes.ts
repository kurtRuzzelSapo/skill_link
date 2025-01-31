import { Routes } from '@angular/router';
import { SocialLayoutComponent } from './layouts/social-layout/social-layout.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { ProfileRecComponent } from '../shared/profile-rec/profile-rec.component';
import { VisitComponent } from '../shared/visit/visit.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'profile', component:ProfileComponent},
  { path: 'profileRec', component:ProfileRecComponent},
  {path: 'visit', title: 'Profile | SkillLink', component: VisitComponent},
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
