import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SocialService } from '../../core/services/social.service';

@Component({
  selector: 'app-profile-rec',
  imports: [ CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavBarComponent],
  templateUrl: './profile-rec.component.html',
  styleUrl: './profile-rec.component.css'
})
export class ProfileRecComponent {

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  editProfileForm!: FormGroup;
  userData: any = {};
  userRoleData: any = {};
  forums: any[] = [];
  displayedForums: any[] = [];
  showAll: boolean = false;
  selectedFile: File | null = null;
resumeUrl: string | null = null;
isUploading: boolean = false;
uploadError: string | null = null;
isModalVisible = false;
editData = { ...this.userData, ...this.userRoleData };
  constructor(
    private router: Router,
    private authService: AuthService,
    private socialService: SocialService,
    private fb: FormBuilder,
    ) {}


  ngOnInit(): void {
    this.fetchUserData();
    this.getMyPost();
    this.initForm();
  }



  initForm(): void {
    this.editProfileForm = this.fb.group({
      name: [this.userData.fullname, Validators.required],
      address: [this.userData.address, Validators.required],
      phone_number: [this.userData.phone_number, Validators.required],
      email: [this.userData.email, Validators.required],
      about: [this.userRoleData.about, Validators.required],
      company: [this.userRoleData.company, Validators.required],
    });
  }

  // openEditModal(type: 'profile' | 'about' | 'skills'): void {
  //   const dialogRef = this.dialog.open(EditModalsComponent, {
  //     width: '900px',
  //     height: 'auto',
  //     data: { ...this.userData, ...this.userRoleData },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.userData = { ...this.userData, ...result };
  //       this.userRoleData.company = result.company;
  //     }
  //   });
  // }




  fetchUserData(): void {
    const userId = this.authService.getID();
    if (userId) {
      this.authService.getMyData(+userId).subscribe({
        next: (response) => {
          this.userRoleData = response.intern_profile? response.intern_profile : response.recruiter_profile;
          this.userData = response.user;
          console.log('User data FROM PROFILE fetched successfully:', response);
          console.log("my dataaaaaa:", this.userData)
          console.log("my role:", this.userData)
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


  getMyPost() {

    const token = this.authService.getToken();
    const userId = this.authService.getID();

    if (!token || !userId) {
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
    company: this.userRoleData.company,
  });
}

closeModal(): void {
  this.isModalVisible = false;
}

// updateProfile

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
        this.userRoleData.company = updatedData.company;

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
