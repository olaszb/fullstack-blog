import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post';
import { Post } from '../../models/post.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.html',
  imports: [DatePipe]
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error = '';

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts().subscribe({
      next: (response) => {
        this.posts = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load posts.';
        this.loading = false;
      },
    });
  }
}