import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SocialService } from '../../../core/services/social.service';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { Subscription } from 'rxjs';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
@Component({
  selector: 'app-home',
  imports: [CommonModule, GalleriaModule, TimeAgoPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  forums: any[] = [];
  topForums: any[] = [];
  internForums:any[] = [];
  recruiterForums:any[] = [];
  recentForums: any[] = [];
  userData: any = {};
  userRoleData: any = {};
  isDropdownOpen = false;
  isLoading = true;
  selectedFile: File | null = null; // For storing the selected image file
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private socialService: SocialService
  ) {}

  ngOnInit(): void {
    this.fetchUserData();
    this.getForums();
  }

  responsiveOptions: any[] = [
    {
      breakpoint: '991px',
      numVisible: 4
    },
    {
      breakpoint: '767px',
      numVisible: 3
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];

  fetchUserData(): void {
    const userId = this.authService.getID();
    if (userId) {
      this.authService.getMyData(+userId).subscribe({
        next: (response) => {
          this.userRoleData = response.intern_profile? response.intern_profile : response.recruiter_profile;
          this.userData = response.user;
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

  getForums() {
    const subscription = this.socialService.getForums().subscribe({
      next: (response) => {
        this.isLoading = false;
        const userId = this.authService.getID();

        // Add separate arrays for intern and recruiter posts
        this.recentForums = response.posts.slice(0, 2);
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
        console.log("Top posts:", this.topForums);
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

  showFullImage(imageSrc: string) {
    window.open(imageSrc, '_blank');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  addNewPost(post: any) {
    const userId = this.authService.getID();
    // Process the new post similar to existing posts
    const processedPost = {
      ...post.post, // Note: The API response might wrap the post data
      isLiked: post.post.likes.some((like: any) => like.user_id === userId),
      galleryImages: post.post.images.map((img: any) => ({
        itemImageSrc: img.image_path
      }))
    };

    // Add to the beginning of the forums array
    this.forums.unshift(processedPost);

    // Also update other relevant arrays if needed
    if (processedPost.user.role === 'intern') {
      this.internForums.unshift(processedPost);
    } else if (processedPost.user.role === 'recruiter') {
      this.recruiterForums.unshift(processedPost);
    }
  }


  likePost(forumId: number, forum: any): void {
    if (forum.isLiked) {
      console.warn('Post is already liked.');
      return;
    }

    const data = { forum_id: forumId, user_id: this.authService.getID() };

    // Optimistic update
    const previousLikesCount = forum.likes_count;
    forum.likes_count++;
    forum.isLiked = true;

    this.socialService.likePost(data).subscribe({
      next: (response: any) => {
        console.log('Like successful:', response);
      },
      error: (error: any) => {
        console.error('Error liking the post:', error);
        // Rollback changes if the API call fails
        forum.likes_count = previousLikesCount;
        forum.isLiked = false;

        if (error.status === 403) {
          console.warn('You have already liked this post.');
        }
      },
    });
  }
}
