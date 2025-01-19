import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InternComponent } from './intern/intern.component';
import { RecruiterComponent } from './recruiter/recruiter.component';
import { CommentComponent } from './comment/comment.component';


export const socialRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'intern', component: InternComponent },
  { path: 'recruiter', component:RecruiterComponent},
  { path: 'comment', component:CommentComponent},

  { path: '**', redirectTo: 'home' },
];
