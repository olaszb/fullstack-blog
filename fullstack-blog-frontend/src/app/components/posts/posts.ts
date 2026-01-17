import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post';
import { Post } from '../../models/post.model';
import { DatePipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.html',
  imports: [RouterLink, DatePipe],
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error = '';

  currentPage = 1;
  lastPage = 1;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;

    this.postService.getPosts(this.currentPage).subscribe({
      next: (response) => {
        this.posts = response.data;
        this.currentPage = response.current_page;
        this.lastPage = response.last_page;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load posts.';
        this.loading = false;
      },
    });
  }

  changePage(newPage: number): void {
    if(newPage >= 1 && newPage <= this.lastPage && newPage !== this.currentPage){
      
           window.scrollTo({ top: 0, behavior: 'smooth' });
      
      
      this.currentPage = newPage;
      this.loadPosts();
    }
  }
}
