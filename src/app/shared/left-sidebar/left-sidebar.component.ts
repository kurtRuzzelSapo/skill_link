import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
// import { Menu } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarModule,  TooltipModule, ButtonModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css'
})
export class LeftSidebarComponent {
  userData: any = {};
  userRoleData: any = {};
  isLoading = true;
  constructor(private router: Router, private authService: AuthService ){}
  ngOnInit() {
    this.fetchUserData();
}


fetchUserData(): void {
  const userId = this.authService.getID();
  if (userId) {
    this.authService.getMyData(+userId).subscribe({
      next: (response) => {

        this.userRoleData = response.intern_profile ? response.intern_profile : response.recruiter_profile;
        this.userData = response.user;
        // console.log('User data fetched successfully:', response);
        this.isLoading = false;
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
}
