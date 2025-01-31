import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarModule, Menu, TooltipModule, ButtonModule
  ],
    templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  items: MenuItem[] | undefined;
  userData: any = {};
  userRoleData: any = {};
constructor(private router: Router, private authService: AuthService ){}
  ngOnInit() {
    this.fetchUserData();
}
  routes = [
    { path: '/social/intern', label: 'Intern', icon: 'pi pi-users', Tooltip:'Intern' },
    { path: '/social/home', label: 'Home', icon: 'pi pi-home',Tooltip:'Home'   },
    { path: '/social/recruiter', label: 'Recruiter', icon: 'pi pi-briefcase', Tooltip:'Recruiter'  }
  ];


  fetchUserData(): void {
    const userId = this.authService.getID();
    if (userId) {
      this.authService.getMyData(+userId).subscribe({
        next: (response) => {
          this.userRoleData = response.intern_profile ? response.intern_profile : response.recruiter_profile;
          this.userData = response.user;
          // console.log('User data fetched successfully:', response);

          // Initialize items after fetching user data
          this.items = [
            {
              label: this.userData.fullname,
              items: [
                {
                  label: 'Profile',
                  icon: 'pi pi-user',
                  command: () => {
                    if(this.userData.role == 'intern'){
                      this.router.navigate(['/profile']);
                    }else{
                      this.router.navigate(['/profileRec']);
                    }
                    // this.authService.clearUserData();
                  },
                },
                {
                  label: 'Log out',
                  icon: 'pi pi-sign-out',
                  command: () => {
                    this.router.navigate(['/login']);
                    this.authService.clearUserData();
                  },
                },
              ],
            },
          ];
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
