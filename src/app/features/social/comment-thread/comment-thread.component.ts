import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-comment-thread',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

  ],
  templateUrl: './comment-thread.component.html',
  styleUrls: ['./comment-thread.component.css']
})
export class CommentThreadComponent {
  @Input() comments: any[] = [];
  @Input() replyForm!: FormGroup;
  @Input() visibleFormId: number | null = null;
  @Output() submitReply = new EventEmitter<{commentId: number, forumId: number}>();
  @Output() cancelReplyForm = new EventEmitter<void>();

  showFormComment(commentId: number): void {
    this.visibleFormId = commentId;
  }

  onSubmitReply(commentId: number, forumId: number): void {
    if (this.replyForm.valid) {
      this.submitReply.emit({ commentId, forumId });
      this.replyForm.reset();
    }
  }

  cancelReply(): void {
    this.cancelReplyForm.emit();
    this.visibleFormId = null;
    this.replyForm.reset();
  }
}
