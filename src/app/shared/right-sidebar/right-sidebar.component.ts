import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SocialService } from '../../core/services/social.service';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.css'
})
export class RightSidebarComponent implements OnInit {
  forums: any[] = [];
  topForums: any[] = [];
  unansweredForums: any[] = [];
  internForums:any[] = [];
  recruiterForums:any[] = [];
  recentForums: any[] = [];
  isLoading = true;
  private subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private socialService: SocialService
  ) {}
  ngOnInit(): void {
    this.getForums();
  }

  getForums() {
    const subscription = this.socialService.getForums().subscribe({
      next: (response) => {
        this.isLoading = false;
        const userId = this.authService.getID();

        // Add separate arrays for intern and recruiter posts
        this.recentForums = response.posts.slice(0, 2);
        this.unansweredForums = response.posts.filter((forum: any) => forum.comments.length === 0).slice(0, 2);
        this.topForums = response.top_posts;
        this.internForums = response.intern_posts || [];  // Handling if not returned
        this.recruiterForums = response.recruiter_posts || [];

        // Process posts with like check
        this.forums = response.posts.map((forum: any) => ({
          ...forum,
          isLiked: forum.likes.some((like: any) => like.user_id === userId),
          galleryImages: forum.images.map((img: any) => ({
            itemImageSrc: img.image_path
          }))
        }));

        // ✅ Logging all the data for debugging
        console.log("Top posts: FROM RIGHT", this.topForums);
        console.log('Forums retrieved:', this.forums);
        console.log('Intern posts:', this.internForums);
        console.log('Recruiter posts:', this.recruiterForums);
      },
      error: (error) => {
        console.error('Error retrieving forums:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    });
    this.subscriptions.push(subscription);
  }
}
