import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SocialService } from '../../../core/services/social.service';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recruiter',
  standalone: true,
  imports: [CommonModule, GalleriaModule],
  templateUrl: './recruiter.component.html',
  styleUrl: './recruiter.component.css'
})
export class RecruiterComponent implements OnInit, OnDestroy {
  recruiterForums: any[] = [];
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

  responsiveOptions = [
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

  getForums() {
    const subscription = this.socialService.getForums().subscribe({
      next: (response) => {
        this.isLoading = false;
        const userId = this.authService.getID();
        this.recruiterForums = (response.recruiter_posts || []).map((forum: any) => ({
          ...forum,
          isLiked: forum.likes?.some((like: any) => like.user_id === userId) || false,
          likes_count: forum.likes?.length || 0,
          comments_count: forum.comments?.length || 0,
          galleryImages: forum.images?.map((img: any) => ({
            itemImageSrc: img.image_path
          })) || []
        }));
      },
      error: (error) => {
        console.error('Error retrieving forums:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
    this.subscriptions.push(subscription);
  }

  showFullImage(imageSrc: string) {
    window.open(imageSrc, '_blank');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  commentPost(postId: number, forum: any): void {
    this.router.navigate(['/social/comment'], { state: { forum, postId } });
  }
}
