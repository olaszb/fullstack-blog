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
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<PaginatedPosts> {
    return this.http.get<PaginatedPosts>(`${this.baseUrl}/posts`);
  }

  getPostBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/posts/${slug}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  createPost(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/post/create`, data);
  }

  uploadImage(image: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<{ url: string }>(`${this.baseUrl}/post/upload-image`, formData);
  }

  getUserPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/posts`);
  }
}
