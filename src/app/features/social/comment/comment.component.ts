import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SocialService } from '../../../core/services/social.service';
import { GalleriaModule } from 'primeng/galleria';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { CommentThreadComponent } from '../comment-thread/comment-thread.component';

@Component({
  selector: 'app-comment',
  imports: [FormsModule,
            ReactiveFormsModule,
            RouterModule,
            ReactiveFormsModule,
            GalleriaModule,
            TimeAgoPipe,
            CommentThreadComponent
           ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  forum: any;
  forumUser: any;
  recentForums: any[] = [];
  forums: any[] = [];
  topForums: any[] = [];
  userData: any = {};
  userRoleData: any = {};
  isDropdownOpen = false;
  stateData: any = {};
  isFormVisible = false;
  commentText = '';
  commentForm: FormGroup;
  replyForm: FormGroup;
  comments: any[]= [];
  visibleFormId: number | null = null;
  isLoading = true;
  showButtons: boolean = false;

  likedComments: boolean[] = [];
  replyFormIndex: number | null = null; // Tracks which comment's reply form is open
  replyText: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private socialService: SocialService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required,]],
    })

    this.replyForm = this.fb.group({
      reply: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.stateData = history.state;

    if (this.stateData?.forum) {

        this.forum = this.stateData.forum;
        this.forumUser = this.stateData.userData;
        this.isLoading = false;
        // console.log('Forum:', this.forum);
        // console.log('userData:', this.stateData);
        // console.log('Post ID:', this.stateData.postId);
    } else {
        console.warn('No forum data received.');
    }
    // this.fetchUserData();
    // this.getForums();
    this.getComments(this.forum.id);
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


submitComment():void {
  if(this.commentForm.valid) {
     const formData = new FormData();
      formData.append('forum_id', this.forum.id);
      formData.append('user_id', this.getLoggedInUserId().toString());
      formData.append('comment', this.commentForm.get('comment')?.value);

      this.socialService.addComment(formData).subscribe({
          next: (response) => {
              console.log('Comment added successfully:', response);
              this.getForums();


              this.isFormVisible = false;
              this.commentForm.reset();
              this.commentText = '';
              this.getComments(this.forum.id);
              this.cancelInput()
              this.forum.comments_count++;
          },
          error: (error) => {
              console.error('Failed to add comment:', error);
              if (error.status === 401) {
                  this.router.navigate(['/login']);
              }
          },
      });
  }
}

cancelInput() {
  this.commentForm.reset();
  this.showButtons = false;
}

submitReply(commentId: number, forumId:number): void {
if (this.replyForm.valid) {
  const formData = new FormData();
  formData.append('parent_id', commentId.toString());
  formData.append('user_id', this.getLoggedInUserId().toString());
  formData.append('forum_id', forumId.toString());
  formData.append('comment', this.replyForm.get('reply')?.value);

  this.socialService.addReply(formData).subscribe({
    next: (response) => {
      console.log('Reply added successfully:', response);
      this.getComments(this.forum.id); // Refresh comments to include the new reply
      this.visibleFormId = null; // Hide the form
      this.replyForm.reset();
      this.cancelReplyForm();
    },
    error: (error) => {
      console.error('Failed to add reply:', error);
      if (error.status === 401) {
        this.router.navigate(['/login']);
      }
    },
  });
}
}

getLoggedInUserId(): number {
  const user = JSON.parse(localStorage.getItem('id') || '{}');
  return user;
}

getForums() {
  this.socialService.getForums().subscribe({
    next: (response) => {
      // if (response.posts.length === 0) {
      //   this.isLoading = false;
      // }
      this.isLoading = false;
      const userId = this.getLoggedInUserId();
      this.recentForums = response.posts.slice(0, 2);
      this.topForums = response.top_posts;
      this.forums = response.posts.map((forum: any) => ({
        ...forum,
        isLiked: forum.likes.some((like: any) => like.user_id === userId), // Check if the user has already liked the post
      }));
      console.log("Top post", this.topForums)
      console.log('Forums retrieved:', this.forums);
    },
    error: (error) => {
      console.error('Error retrieving forums:', error);
      if (error.status === 401) {
        this.router.navigate(['/login']);
      }
    },
  });
}

getComments(forumId: number): void {
this.socialService.getComments(forumId).subscribe({
  next: (response) => {
    this.comments = response.data
      .map((comment: any) => this.processComment(comment))
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    console.log('Comments retrieved:', this.comments);
  },
  error: (error) => {
    console.error('Failed to fetch comments:', error);
  },
});
}

private processComment(comment: any): any {
return {
  ...comment,
  user: comment.user,
  replies: (comment.replies || [])
    .map((reply: any) => this.processComment({
      ...reply,
      user: reply.user || comment.user
    }))
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort replies by date
};
}

private getReplies(allComments: any[], parentId: number): any[] {
const directReplies = allComments.filter(comment => comment.parent_id === parentId);
console.log(`Direct replies for parent ${parentId}:`, directReplies); // Log direct replies

return directReplies.map(reply => ({
  ...reply,
  replies: this.getReplies(allComments, reply.id)
}));
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

Back(): void {
  this.router.navigate(['/social/home']);
}

toggleLike(index: number): void {
  this.likedComments[index] = !this.likedComments[index];
}

toggleReplyForm(index: number): void {
  this.replyFormIndex = this.replyFormIndex === index ? null : index;
}

cancelReplyForm(): void {
  this.replyFormIndex = null;
  this.replyText = '';
}

Reply(commentId: number): void {
  if (this.replyText.trim()) {
    console.log(`Replying to comment ID ${commentId}: ${this.replyText}`);
    this.cancelReplyForm();
  }
}

}
