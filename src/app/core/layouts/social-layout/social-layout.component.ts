import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {  RouterModule, ActivatedRoute, RouterOutlet, Router } from '@angular/router';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';
import { LeftSidebarComponent } from '../../../shared/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../../../shared/right-sidebar/right-sidebar.component';
import { ButtonModule } from 'primeng/button';
import { MenuTemplateDemoComponent } from '../../../shared/menu-template-demo/menu-template-demo.component';
import { PostDialogComponent } from '../../../shared/post-dialog/post-dialog.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HomeComponent } from '../../../features/social/home/home.component';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-social-layout',
  standalone: true,
  imports: [CommonModule,PostDialogComponent,RouterModule,NavBarComponent,ToastModule, LeftSidebarComponent, RightSidebarComponent, ButtonModule, MenuTemplateDemoComponent],
  providers: [MessageService],
  templateUrl: './social-layout.component.html',
  styleUrl: './social-layout.component.css'
})
export class SocialLayoutComponent implements OnInit {

  visible: boolean = false;
  isCommentRoute: boolean = false;
  showPostButton: boolean = false;
  userData: any = {};
  @ViewChild('homeComponent') homeComponent!: any;
  @ViewChild(RouterOutlet) outlet!: RouterOutlet;

    constructor(
      private messageService: MessageService,
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService,
    ){}

    ngOnInit(): void {
      this.fetchUserData()
      this.router.events.subscribe(() => {
        // Update the flag based on the current route
        this.isCommentRoute = this.router.url === '/social/comment';
      });

      this.router.events.subscribe(() => {
        // Get the current route
        const currentRoute = this.router.url;

        // Check if the current route is recruiter-specific or intern-specific
        if (
          (this.userData.role == 'intern' && this.router.url == '/social/recruiter' ||
          (this.userData.role == 'recruiter' && this.router.url == '/social/intern'))
        ) {
          this.showPostButton = true;
        } else {
          this.showPostButton = false;
        }
      });


    }


    showPostDialog() {
      console.log('Post dialog opened.');
      this.visible = true;
    }

    fetchUserData(): void {
      const userId = this.authService.getID();
      if (userId) {
        this.authService.getMyData(+userId).subscribe({
          next: (response) => {
            // this.userRoleData = response.intern_profile? response.intern_profile : response.recruiter_profile;
            this.userData = response.user;

            // console.log('User data fetched successfully:', response);
            // console.log('User data ROLE LAYOUTTT:', this.userData.role);
            // console.log("my data:", this.userData)
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

  routes = [
    { path: '/social/intern', label: 'Intern' },
    { path: '/social/home', label: 'Home' },
    { path: '/social/recruiter', label: 'Recruiter' },
  ];

  isActive(route: string): boolean {
    return window.location.pathname === route;
  }



  handlePostCreated(event: any) {
    this.visible = false;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([window.location.pathname]);
    });
    this.messageService.add({ severity: 'success', summary: 'Success', detail: event.message, life: 3000 });
  }

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
