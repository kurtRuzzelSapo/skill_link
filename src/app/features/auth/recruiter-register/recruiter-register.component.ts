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
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-recruiter-register',
  imports: [  ButtonModule,
    InputTextModule,
    IftaLabelModule,
    CommonModule,
    FormsModule,
    FloatLabelModule,
    ReactiveFormsModule,
    RouterModule,
    StepperModule,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './recruiter-register.component.html',
  styleUrl: './recruiter-register.component.css'
})
export class RecruiterRegisterComponent {
  specializations: string[] = [];
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
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      company: ['', Validators.required],
      position: ['', Validators.required],
      industry: ['', Validators.required],
      hobbies: ['', Validators.required],
      interest: ['', Validators.required],
      specialization:[''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
     } , {
        validator: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    // Any additional initialization logic can go here
  }


  addSkill(): void {
    const newSpel = this.signupForm.get('specialization')?.value?.trim();
    if (newSpel && !this.specializations.includes(newSpel)) {
      this.specializations.push(newSpel);
      this.signupForm.get('specialization')?.reset(); // Clear input after adding
    } else if (this.specializations.includes(newSpel)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Skill',
        detail: 'This skill already exists.',
        life: 2000
      });
    }
  }



  onKeyUp(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value.trim();
    if (event.key === 'Enter' && input) { // Add specialization on Enter key
      if (!this.specializations.includes(input)) {
        this.specializations.push(input); // Add to the array
      }
      this.signupForm.get('specialization')?.setValue(''); // Clear input field
    }
  }

  // Method to remove a specialization
  removeSkill(skill: string): void {
    this.specializations = this.specializations.filter(s => s !== skill); // Remove from array
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value ? null : {'mismatch': true};
  }

  registerRecruiter(): void {
    if (this.signupForm.valid) {

      const formData = {
        ...this.signupForm.value,
        specialization: this.specializations, // Ensure this is an array
      };

      this.authService.registerRecruiter(formData).subscribe({
        next: (response) => {
          console.log(response);
          this.authService.setLoginData(response.token, response.role, response.id);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message, life: 3000 });

          // Navigate to login after a delay
          setTimeout(() => {
              this.router.navigate(['/login']);
          }, 1500); // Navigate to login after 3 seconds
        },
        error: (error) => {
          if (error.status === 422 && error.error.errors?.email) {
            this.errorMessage = error.error.errors.email[0]; // Extract email error
            console.log(this.errorMessage);
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }
        }
      });
    }else{
      console.log('Form Errors:', this.signupForm.errors);
      console.log('Form Submitted:', this.signupForm.value);
      Object.keys(this.signupForm.controls).forEach(control => {
        const errors = this.signupForm.get(control)?.errors;
        if (errors) {
          console.log(`${control} Errors:`, errors);
        }
      });
    }
  }
}
