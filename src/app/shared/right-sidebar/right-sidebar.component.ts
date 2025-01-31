import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SocialService } from '../../core/services/social.service';
import { Subscription, interval, switchMap, takeUntil, Subject } from 'rxjs';


@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css'] // Fixed typo for `styleUrls`
})
export class RightSidebarComponent implements OnInit, OnDestroy {
  forums: any[] = [];
  topForums: any[] = [];
  unansweredForums: any[] = [];
  internForums: any[] = [];
  recruiterForums: any[] = [];
  recentForums: any[] = [];
  isLoading = true;

  private subscriptions: Subscription[] = [];
  private destroy$ = new Subject<void>(); // To manage unsubscribing for polling

  constructor(
    private router: Router,
    private authService: AuthService,
    private socialService: SocialService
  ) {}

  ngOnInit(): void {
    this.startDataPolling(); // Start polling data on component initialization
  }

  /**
   * Poll the data from the API every 10 seconds
   */
  startDataPolling(): void {
    interval(1500) // Poll every 5 seconds
      .pipe(
        switchMap(() => this.socialService.getForums()), // Fetch the data
        takeUntil(this.destroy$) // Automatically stop when component is destroyed
      )
      .subscribe({
        next: (response) => this.processForums(response),
        error: (error) => this.handleError(error),
      });
  }

  /**
   * Fetch the forums data manually (can be triggered by events if needed)
   */
  getForums(): void {
    const user_id = this.authService.getID();
    const subscription = this.authService.getMyFilterForums(user_id).subscribe({
      next: (response) => this.processForums(response),
      error: (error) => this.handleError(error),
    });
    this.subscriptions.push(subscription);
  }

  /**
   * Process the forums response and update local state
   */
  processForums(response: any): void {
    this.isLoading = false;
    const userId = this.authService.getID();

    // Update the arrays for different forum categories
    // this.recentForums = response.posts.slice(0, 2);
    // this.unansweredForums = response.posts.filter((forum: any) => forum.comments.length === 0).slice(0, 2);
    // this.topForums = response.top_posts;
    this.internForums = response.intern_posts || [];
    this.recruiterForums = response.recruiter_posts || [];

    // Map and update the forums with dynamic data
    this.topForums = response.top_posts
    .map((forum: any) => ({
      ...forum,
      isLiked: forum.likes.some((like: any) => like.user_id === userId),
      galleryImages: forum.images.map((img: any) => ({
        itemImageSrc: img.image_path,
      })),
    }))


  this.unansweredForums = response.posts
    .filter((forum: any) => forum.comments.length === 0) // Ensure unanswered forums only
    .map((forum: any) => ({
      ...forum,
      isLiked: forum.likes.some((like: any) => like.user_id === userId),
      galleryImages: forum.images.map((img: any) => ({
        itemImageSrc: img.image_path,
      })),
    }))
      .slice(0, 2);


    this.forums = response.posts.map((forum: any) => ({
      ...forum,
      isLiked: forum.likes.some((like: any) => like.user_id === userId),
      galleryImages: forum.images.map((img: any) => ({
        itemImageSrc: img.image_path,
      })),
    }));

    // Log for debugging
    // console.log('Updated Top Forums:', this.topForums);
    // console.log('Updated Forums:', this.forums);
  }

  /**
   * Handle errors during API calls
   */
  handleError(error: any): void {
    console.error('Error retrieving forums:', error);
    if (error.status === 401) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Clean up subscriptions and polling when the component is destroyed
   */
  ngOnDestroy(): void {
    // Unsubscribe from manual subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    // Stop polling by completing the destroy subject
    this.destroy$.next();
    this.destroy$.complete();
  }

  commentPost(postId: number, forum: any): void {
    this.router.navigate(['/social/comment'], { state: { forum, postId } });
  }
}
