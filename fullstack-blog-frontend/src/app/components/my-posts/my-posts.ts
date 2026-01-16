import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post';
import { Auth } from '../../services/auth'; // Import Auth Service
import { Post } from '../../models/post.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// Helper Interface for our Groups
interface PostGroup {
  authorName: string;
  posts: Post[];
}

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.html',
  standalone: true,
  imports: [RouterLink, DatePipe],
})
export class MyPostsComponent implements OnInit {
  postGroups: PostGroup[] = [];

  loading = true;
  error = '';
  isAdmin = false;

  constructor(private postService: PostService, private auth: Auth) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin();

    if (this.isAdmin) {
      this.loadAdminView();
    } else {
      this.loadUserView();
    }
  }

  loadUserView() {
    this.postService.getUserPosts().subscribe({
      next: (response: any) => {
        const posts = response.posts?.data || [];

        this.postGroups = [{ authorName: 'My Posts', posts: posts }];
        this.loading = false;
      },
      error: (err) => this.handleError(err),
    });
  }

  loadAdminView() {
    this.postService.getAdminPostsGrouped().subscribe({
      next: (response: any) => {
        const users = response.data || [];

        this.postGroups = users.map((user: any) => ({
          authorName: user.name + "'s Posts",
          posts: user.posts,
        }));
        this.loading = false;
      },
      error: (err) => this.handleError(err),
    });
  }

  handleError(err: any) {
    console.error(err);
    this.error = 'Failed to load posts.';
    this.loading = false;
  }

  getImageUrl(post: any): string | null {
    if (post.thumbnail_url) return post.thumbnail_url;
    // Fallback if backend doesn't send thumbnail_url but sends thumbnail
    if (post.thumbnail) return `http://127.0.0.1:8000/storage/${post.thumbnail}`;
    return null;
  }
}
