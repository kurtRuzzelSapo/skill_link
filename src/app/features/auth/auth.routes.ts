import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { InternRegisterComponent } from './intern-register/intern-register.component';
import { RecruiterRegisterComponent } from './recruiter-register/recruiter-register.component';

export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'intern', component: InternRegisterComponent },
  { path: 'recruiter', component: RecruiterRegisterComponent },
];
