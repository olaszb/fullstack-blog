import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

interface PaginatedPosts {
  current_page: number;
  data: Post[];
  total: number;
  last_page: number;
}


@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://127.0.0.1:8000/api/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<PaginatedPosts> {
    return this.http.get<PaginatedPosts>(this.apiUrl);
  }

  getPostBySlug(slug: string): Observable<Post> {
  return this.http.get<Post>(`${this.apiUrl}/${slug}`);
  }

  
}