import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from "primeng/floatlabel"
import { IftaLabelModule } from 'primeng/iftalabel';
import { Router, RouterModule } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-intern-register',
  imports: [
    StepperModule,
    ButtonModule,
    InputTextModule,
    IftaLabelModule,
    CommonModule,
    FormsModule,
    FloatLabelModule,
    ReactiveFormsModule,
    RouterModule,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './intern-register.component.html',
  styleUrl: './intern-register.component.css'
})
export class InternRegisterComponent implements OnInit {
  errorMessage: string | null = null;
  backendErrors: { [key: string]: string[] } | null = null;
  activeStep: number = 1;
  signupForm: FormGroup;
  formErrors$: Observable<any> = new Observable;

  constructor(private fb: FormBuilder,  private router: Router,
    private authService: AuthService, private messageService: MessageService) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullname: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      school: ['', Validators.required],
      degree: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this.formErrors$.subscribe(errors => console.log('Form Errors:', errors));
  }

  // getFormErrors(): Observable<any> {
  //   return combineLatest([
  //     this.loginForm.get('email')?.statusChanges ?? new Observable(),
  //     this.loginForm.get('fullname')?.statusChanges ?? new Observable(),
  //     this.loginForm.get('phone_number')?.statusChanges ?? new Observable(),
  //     this.loginForm.get('address')?.statusChanges ?? new Observable(),
  //     this.loginForm.get('gender')?.statusChanges ?? new Observable(),
  //     this.loginForm.get('school')?.statusChanges ?? new Observable(),
  //     this.loginForm.get('degree')?.statusChanges ?? new Observable(),
  //     this.loginForm.get('password')?.statusChanges ?? new Observable(),
  //     this.loginForm.get('password_confirmation')?.statusChanges ?? new Observable()
  //   ]).pipe(
  //     map(() => {
  //       return {
  //         email: this.loginForm.get('email')?.errors,
  //         fullname: this.loginForm.get('fullname')?.errors,
  //         phone_number: this.loginForm.get('phone_number')?.errors,
  //         address: this.loginForm.get('address')?.errors,
  //         gender: this.loginForm.get('gender')?.errors,
  //         school: this.loginForm.get('school')?.errors,
  //         degree: this.loginForm.get('degree')?.errors,
  //         password: this.loginForm.get('password')?.errors,
  //         password_confirmation: this.loginForm.get('password_confirmation')?.errors
  //       };
  //     })
  //   );
  // }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value ? null : {'mismatch': true};
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     console.log(this.loginForm.value);
  //     // Handle form submission
  //   } else {
  //     console.log('Form is invalid', this.loginForm.errors);
  //   }
  // }

  registerIntern(): void {
    if (this.signupForm.valid) {
      this.authService.registerIntern(this.signupForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.authService.setLoginData(response.token, response.role, response.id);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message, life: 3000 });

          // Navigate to login after a delay
          setTimeout(() => {
              this.router.navigate(['/login']);
          }, 3000); // Navigate to login after 3 seconds
        },
        error: (error) => {
          if (error.status === 422 && error.error.errors?.email) {
            this.errorMessage = error.error.errors.email[0]; // Extract email error
            this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage ?? 'Invalid Email' });
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }
        }
      });
    }
  }

  show() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });

    // Navigate to login after a delay
    // setTimeout(() => {
    //     this.router.navigate(['/login']);
    // }, 3000); // Navigate to login after 3 seconds
}
}
