import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post';
import { Post } from '../../models/post.model';
import { CommonModule } from '@angular/common'; // Import CommonModule for pipes/directives
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './post-detail.html',
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  loading = true;
  error = '';
  isArchivedView = false;

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit(): void {
    // Check if the current URL contains 'archived'
    const url = this.route.snapshot.url.map((segment) => segment.path).join('/');
    this.isArchivedView = url.includes('archived');

    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.loadPost(slug);
      }
    });
  }

  loadPost(slug: string) {
    this.loading = true;

    // Choose the correct service call based on the route
    const request$ = this.isArchivedView
      ? this.postService.getArchivedPostBySlug(slug)
      : this.postService.getPostBySlug(slug);

    request$.subscribe({
      next: (data) => {
        this.post = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Post not found or access denied.';
        this.loading = false;
      },
    });
  }
}
