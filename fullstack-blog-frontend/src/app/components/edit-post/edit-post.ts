import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../services/post';
import { Post } from '../../models/post.model';
import EasyMDE from 'easymde';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.html',
  standalone: true,
  imports: [FormsModule, RouterLink],
})
export class EditPostComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('markdownEditor') markdownEditor!: ElementRef;
  easyMDE!: EasyMDE;

  post: any = {
    id: 0,
    title: '',
    content: '',
    category_id: '',
    thumbnail_url: null,
  };

  isArchivedView = false;

  categories: any[] = [];
  loading = false;
  message = '';
  error = '';
  selectedFile: File | null = null;

  imagePreview: string | SafeUrl | null = null;

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadCategories();

    const url = this.route.snapshot.url.map((segment) => segment.path).join('/');
    this.isArchivedView = url.includes('archived');

    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.loadPostData(slug);
      }
    });
  }

  loadPostData(slug: string) {
    this.loading = true;

    const request$ = this.isArchivedView
      ? this.postService.getArchivedPostBySlug(slug)
      : this.postService.getPostBySlug(slug);

    request$.subscribe({
      next: (data: Post) => {
        this.post = { ...data };

        if (this.post.thumbnail && !this.post.thumbnail_url) {
          this.post.thumbnail_url = `http://127.0.0.1:8000/storage/${this.post.thumbnail}`;
        }

        if (this.easyMDE) {
          this.easyMDE.value(this.post.content);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not load post data. It may have been moved or deleted.';
        this.loading = false;
      },
    });
  }

  loadCategories() {
    this.postService.getCategories().subscribe({
      next: (res) => (this.categories = res),
    });
  }

  onThumbnailSelected(event: any) {
    const file: File = event.target.files[0];
    this.error = '';

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.error = 'Invalid file type. Only JPG, PNG, and GIF are allowed.';
        this.resetFileSelection(event);
        return;
      }

      const maxSizeInMB = 2;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        this.error = `File is too large. Max size is ${maxSizeInMB}MB.`;
        this.resetFileSelection(event);
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(result);
      };
      reader.readAsDataURL(file);
    }
  }

  resetFileSelection(event: any) {
    this.selectedFile = null;
    this.imagePreview = null;
    event.target.value = '';
  }

  ngAfterViewInit() {
    this.easyMDE = new EasyMDE({
      element: this.markdownEditor.nativeElement,
      spellChecker: false,
      status: ['autosave', 'lines', 'words', 'cursor'],
      minHeight: '400px',
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
      ],
    });

    this.easyMDE.codemirror.on('change', () => {
      this.post.content = this.easyMDE.value();
    });
  }

  onArchive() {
    if (confirm('Are you sure you want to archive this post? It will be hidden from the public.')) {
      this.loading = true;
      this.postService.archivePost(this.post.id).subscribe({
        next: () => {
          this.router.navigate(['/user/posts']);
        },
        error: (err) => {
          this.error = 'Failed to archive post.';
          this.loading = false;
        },
      });
    }
  }

  onRestore() {
    if (confirm('Restoring this post will make it visible to the public again. Continue?')) {
      this.loading = true;
      this.postService.restorePost(this.post.id).subscribe({
        next: () => {
          this.loading = false;
          this.post.deleted_at = null;
          this.message = 'Post restored successfully!';
          setTimeout(() => this.router.navigate(['/user/posts']), 1000);
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to restore post.';
          this.loading = false;
        },
      });
    }
  }

  onSubmit() {
    this.error = '';
    this.message = '';

    if (this.easyMDE) {
      this.post.content = this.easyMDE.value();
    }

    if (!this.post.title.trim() || !this.post.content.trim()) {
      this.error = 'Title and content are required.';
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    formData.append('category_id', this.post.category_id);

    if (this.selectedFile) {
      formData.append('thumbnail', this.selectedFile);
    }

    this.postService.updatePost(this.post.id, formData).subscribe({
      next: (res) => {
        this.message = 'Post updated successfully!';
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;

        if (err.status === 422 && err.error && err.error.message) {
          this.error = err.error.message;

          if (err.error.errors) {
            const details = Object.values(err.error.errors).flat().join(' ');
            this.error += ' ' + details;
          }
        } else if (err.status === 413) {
          this.error = 'File is too large for the server to handle.';
        } else {
          this.error = 'An unexpected error occurred. Please try again.';
        }
      },
    });
  }

  ngOnDestroy() {
    if (this.easyMDE) {
      this.easyMDE.toTextArea();
      this.easyMDE.cleanup();
    }
  }

  onForceDelete() {
    if (
      confirm(
        'WARNING: This will permanently delete the post and its image. This action cannot be undone. Are you sure?'
      )
    ) {
      this.loading = true;
      this.postService.deletePostPermanently(this.post.id).subscribe({
        next: () => {
          this.loading = false;
          alert('Post permanently deleted.');
          this.router.navigate(['/user/posts']);
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to permanently delete post.';
          this.loading = false;
        },
      });
    }
  }
}
