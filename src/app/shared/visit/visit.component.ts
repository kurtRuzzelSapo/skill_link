import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { SocialService } from '../../core/services/social.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-visit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavBarComponent],
  templateUrl: './visit.component.html',
  styleUrl: './visit.component.css'
})
export class VisitComponent {
  editProfileForm!: FormGroup;
  interviews: any = {};
  userData: any = {};
  stateData: any = {};
  userRoleData:any = {};
  displayedForums: any[] = [];
  forums: any[] = [];
  showAll: boolean = false;
  isModalVisible = false;
  constructor( private router: Router,  private authService: AuthService, private socialService: SocialService,  private fb: FormBuilder,) {}

  ngOnInit(): void {
    this.stateData = history.state;
    console.log(this.stateData)
    // const userId = this.getLoggedInUserId();
    this.fetchUserData();
    this.getMyPost();
    this.getMyInterviews();
  }



  // initForm(): void {
  //   this.editProfileForm = this.fb.group({
  //     name: [this.userData.fullname, Validators.required],
  //     address: [this.userData.address, Validators.required],
  //     phone_number: [this.userData.phone_number, Validators.required],
  //     email: [this.userData.email, Validators.required],
  //     about: [this.userRoleData.about, Validators.required],
  //     school: [this.userRoleData.school, Validators.required],
  //   });
  // }


  getMyPost() {

    // const token = this.authService.getToken();
    const userId = this.stateData.userId;

    if ( !userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.socialService.getMyForumById(userId).subscribe({
      next: (response) => {
        if (response && response.forums) {
          this.forums = response.forums,
          this.userData = response.user;
          this.displayedForums = this.forums.slice(0, 3);
          console.log('My forums:', this.forums);

        } else {
          console.log('Invalid response structure:', response);
          this.forums = [];
        }
      },
      error: (error) => {
        console.error('Error retrieving forums:', error);
        if (error.status === 401) {
          // this.authService.clearLoginData();
          this.router.navigate(['/login']);
        }
        this.forums = [];
      }
    });
  }


  toggleShowAll() {
    this.showAll = !this.showAll;
    if (this.showAll) {
      this.displayedForums = this.forums;  // Show all posts
    } else {
      this.displayedForums = this.forums.slice(0, 3);  // Show only the first 3 posts
    }
  }

  openModal(): void {
    this.isModalVisible = true;
    // Reset the form with current user data
    this.editProfileForm.patchValue({
      name: this.userData.fullname,
      address: this.userData.address,
      phone_number: this.userData.phone_number,
      email: this.userData.email,
      about: this.userRoleData.about,
      school: this.userRoleData.school,
    });
  }

  getMyInterviews() {

    // const token = this.authService.getToken();
    const userId = this.stateData.userId;

    if ( !userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.socialService.getMyInterviews(userId).subscribe({
      next: (response) => {
        if (response) {
          this.interviews = response,
          console.log('My Interviews:', this.interviews);

        } else {
          console.log('Invalid response structure:', response);

        }
      },
      error: (error) => {
        console.error('Error retrieving forums:', error);
        if (error.status === 401) {
          // this.authService.clearLoginData();
          this.router.navigate(['/login']);
        }

      }
    });
  }

  fetchUserData(): void {
    const userId = this.stateData.userId;
    if (userId) {
      this.authService.getMyData(this.stateData.userId).subscribe({
        next: (response) => {
          this.userData = response.user;
          this.userRoleData = response.intern_profile? response.intern_profile : response.recruiter_profile;
          console.log('User data fetched successfully:', response);
          console.log("my data:", this.userData)
          // this.userProfileImage = `${this.authService.apiUrl}${this.userData.profile_image}`;
        },
        error: (error) => {
          console.error('Failed to fetch user data:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        },
      });

    } else {
      console.error('No user ID found in local storage.');
      this.router.navigate(['/login']);
    }
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
  }


  onSubmit(): void {
    if (this.editProfileForm.valid) {
      // Add user_id to the payload
      const updatedData = {
        ...this.editProfileForm.value, // Spread the form values
        user_id: this.userData.id,    // Add the user_id from userData
      };

      // Call the service to update the profile
      this.authService.updateProfile(updatedData).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);

          // Optionally update local user data with the response
          this.userData.fullname = updatedData.fullname;
          this.userData.address = updatedData.address;
          this.userData.phone_number = updatedData.phone_number;
          this.userData.email = updatedData.email;
          this.userRoleData.about = updatedData.about;
          this.userRoleData.school = updatedData.school;

          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([window.location.pathname]);
          });

          // Close the modal
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          // Handle error (e.g., display a notification)
        },
      });
    }
  }
}
