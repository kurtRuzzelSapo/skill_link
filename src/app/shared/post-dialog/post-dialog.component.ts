import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PrimeNG } from 'primeng/config';
import { BadgeModule } from 'primeng/badge';
import { ProgressBar } from 'primeng/progressbar';
import { FileUpload } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocialService } from '../../core/services/social.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-post-dialog',
  standalone: true,
  imports: [Dialog, ButtonModule, TextareaModule, InputTextModule, AvatarModule, FileUpload, BadgeModule, ProgressBar, ToastModule, CommonModule, ReactiveFormsModule],
  providers: [MessageService, RouterModule],
  templateUrl: './post-dialog.component.html',
  styleUrl: './post-dialog.component.css'
})
export class PostDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() postCreated = new EventEmitter<any>();
  files: Array<{ raw: File; size: number; objectURL: string; name: string }> = [];
  userData: any = {};
  userRoleData: any = {};
  totalSize: number = 0;
  totalSizePercent: number = 0;
  postForm: FormGroup;
  isSubmitting = false;
  constructor(private config: PrimeNG, private messageService: MessageService, private fb: FormBuilder, private authService: AuthService, private socialService: SocialService,private router: Router) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      desc: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchUserData()
  }

  onClose() {
    this.visible = false;
    this.close.emit();
  }

  choose(event: Event, callback: () => void) {
    callback();
  }

  onRemoveTemplatingFile(event: Event, file: { size: number }, removeFileCallback: (event: Event, index: number) => void, index: number) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: () => void) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  onSelectedFiles(event: { currentFiles: Array<File> }) {
    this.files = event.currentFiles.map((file) => ({
      raw: file, // Store the raw File object
      size: file.size,
      objectURL: URL.createObjectURL(file), // Generate an object URL for preview
      name: file.name || 'Unknown',
    }));

    this.totalSize = this.files.reduce((total, file) => total + file.size, 0);
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback: () => void) {
    callback();
  }

  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes || [];
    if (bytes === 0) {
      return `0 ${sizes[0] || 'B'}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i] || 'B'}`;
  }

  resetForm() {
    this.postForm.reset();
    this.files = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onSubmit() {
    if (this.postForm.invalid) {
      console.error('Form is invalid:', this.postForm.errors);
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('title', this.postForm.get('title')?.value);
    formData.append('desc', this.postForm.get('desc')?.value);
    formData.append('user_id', this.userData.id);

    // Use the raw file for FormData
    this.files.forEach((file, index) => {
      formData.append(`images[${index}]`, file.raw, file.name); // Use `raw` and pass the file name
    });

    this.socialService.createForum(formData).subscribe({
      next: (response) => {
        console.log('Post created successfully:', response);
        this.postCreated.emit({ message: 'Post created successfully', postData: response });
        this.resetForm();
        this.onClose();
      },
      error: (error) => {
        console.error('Failed to create post:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to create post',
        });
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }


  fetchUserData(): void {
    const userId = this.authService.getID();
    if (userId) {
      this.authService.getMyData(+userId).subscribe({
        next: (response) => {
          this.userRoleData = response.intern_profile ? response.intern_profile : response.recruiter_profile;
          this.userData = response.user;
          // console.log('User data fetched successfully:', response);

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
