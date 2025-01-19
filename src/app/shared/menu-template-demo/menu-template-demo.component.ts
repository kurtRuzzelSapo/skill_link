import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
@Component({
  selector: 'app-menu-template-demo',
  imports: [MenuModule, BadgeModule, RippleModule, AvatarModule, CommonModule, RightSidebarComponent],
  templateUrl: './menu-template-demo.component.html',
  styleUrl: './menu-template-demo.component.css'
})
export class MenuTemplateDemoComponent implements OnInit {
  items: MenuItem[] | undefined;
  userData: any = {};
  userRoleData: any = {};
  isLoading = true;
  constructor(private router: Router, private authService: AuthService ){}
  ngOnInit() {
    this.fetchUserData();
  //   this.items = [
  //     {
  //       label: 'Documents',
  //       items: [
  //         { label: 'New', icon: 'pi pi-plus',  },
  //         { label: 'Search', icon: 'pi pi-search',  }
  //       ]
  //     },
  //     {
  //       label: 'Profile',
  //       items: [
  //         { label: 'Settings', icon: 'pi pi-cog',  },
  //         { label: 'Messages', icon: 'pi pi-inbox', }
  //       ]
  //     },
  //     { separator: true }, // Optional separator
  //     {
  //       label: '',
  //       items: [{ label: '', icon: '', command: () => {}, style: { height: '55vh' } }] // Spacer item
  //     },
  //     {
  //       label: '',
  //       icon: 'pi pi-sign-out',
  //       shortcut: '⌘+Q',
  //       command: () => {
  //         console.log('Logout clicked');
  //       }
  //     }

  //   ];
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

  Logout(){
    this.authService.clearUserData();
  }

}
