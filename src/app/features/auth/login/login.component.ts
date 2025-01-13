import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from "primeng/floatlabel"
import { IftaLabelModule } from 'primeng/iftalabel';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

type BackendErrors = {
  [key: string]: string[]; // Each field can have an array of error messages
};
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    StepperModule,
    ButtonModule,
    InputTextModule,
    IftaLabelModule,
    CommonModule,
    FormsModule,
    FloatLabelModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {

  loginForm: FormGroup;
  backendErrors: BackendErrors | null = null; // Allow null initially


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,) {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
      },
    );
  }


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


  login(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          const role:string = response.user.role;
          const token = response.access_token;
          const id = response.user.id;
          console.log('Login successful:', response);
          this.loginForm.reset();
          this.backendErrors = null;
          this.authService.setLoginData(token, role, id);
          console.log("TOKEENNN",this.authService.getToken());
          this.router.navigate(['/social/home']);

        },
        error: (error) => {
          console.error('Login failed:', error);

          // Reset backendErrors
          this.backendErrors = {};

          if (error.status === 422) {
            // Validation errors (e.g., field-specific errors)
            this.backendErrors = error.error.errors;
          } else if (error.status === 403) {
            // General errors (e.g., "Invalid credentials")
            this.backendErrors['general'] = [error.error.error || 'Forbidden'];
          } else {
            // Handle other types of errors (e.g., server or network issues)
            this.backendErrors['general'] = ['An unexpected error occurred. Please try again later.'];
          }
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
