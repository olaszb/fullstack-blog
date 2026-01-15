import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post';
import { Post } from '../../models/post.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.html',
  standalone: true,
  imports: [RouterLink, DatePipe],
})
export class MyPostsComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error = '';

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getUserPosts().subscribe({
      next: (response: any) => {
        this.posts = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load your posts.';
        this.loading = false;
      },
    });
  }
}
