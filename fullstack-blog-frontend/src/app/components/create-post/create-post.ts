import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../services/post';
import EasyMDE from 'easymde';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.html',
  standalone: true,
  imports: [FormsModule],
})
export class CreatePostComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('markdownEditor') markdownEditor!: ElementRef;

  easyMDE!: EasyMDE;

  post = {
    title: '',
    content: '',
    category_id: '',
  };

  categories: any[] = [];
  thumbnailFile: File | null = null;
  loading = false;
  message = '';
  error = '';

  imagePreview: SafeUrl | null = null;

  constructor(
    private postService: PostService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.easyMDE = new EasyMDE({
      element: this.markdownEditor.nativeElement,
      spellChecker: false,
      placeholder: 'Write your cool blog post here... (Drag & Drop images!)',
      status: ['autosave', 'lines', 'words', 'cursor'],

      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
        '|',
        'guide',
      ],
      minHeight: '200px',

      uploadImage: true,
      imageUploadFunction: (file, onSuccess, onError) => {
        this.uploadImageToBackend(file, onSuccess, onError);
      },
    });

    this.easyMDE.codemirror.on('change', () => {
      this.post.content = this.easyMDE.value();
    });
  }

  uploadImageToBackend(
    file: File,
    onSuccess: (url: string) => void,
    onError: (error: string) => void
  ) {
    this.postService.uploadImage(file).subscribe({
      next: (response) => onSuccess(response.url),
      error: (err) => {
        console.error(err);
        onError('Upload failed. Image might be too large.');
      },
    });
  }

  onThumbnailSelected(event: any) {
    const file = event.target.files[0];
    this.error = '';

    if (file) {
      this.thumbnailFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(result);
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnDestroy() {
    if (this.easyMDE) {
      this.easyMDE.toTextArea();
      this.easyMDE.cleanup();
    }
  }

  loadCategories() {
    this.postService.getCategories().subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  onSubmit() {
    this.error = '';

    if (!this.post.title.trim()) {
      this.error = 'Please enter a title.';
      return;
    }
    if (!this.thumbnailFile) {
      this.error = 'Please upload a thumbnail';
      return;
    }

    const content = this.easyMDE.value();
    if (!content.trim()) {
      this.error = 'The post content cannot be empty.';
      return;
    }
    if (!this.post.category_id) {
      this.error = 'Please select a category.';
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', content);
    formData.append('category_id', this.post.category_id);
    formData.append('thumbnail', this.thumbnailFile);

    this.postService.createPost(formData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Something went wrong. Please try again.';
        this.loading = false;
      },
    });
  }
}
