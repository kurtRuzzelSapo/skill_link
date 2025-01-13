import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-social-layout',
  standalone: true,
  imports: [CommonModule,PostDialogComponent,RouterModule,NavBarComponent,ToastModule, LeftSidebarComponent, RightSidebarComponent, ButtonModule, MenuTemplateDemoComponent],
  providers: [MessageService],
  templateUrl: './social-layout.component.html',
  styleUrl: './social-layout.component.css'
})
export class SocialLayoutComponent {
  visible: boolean = false;
  @ViewChild('homeComponent') homeComponent!: any;
  @ViewChild(RouterOutlet) outlet!: RouterOutlet;
    constructor(
      private messageService: MessageService,
      private route: ActivatedRoute,
      private router: Router
    ){}

  showPostDialog() {
    this.visible = true;
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
