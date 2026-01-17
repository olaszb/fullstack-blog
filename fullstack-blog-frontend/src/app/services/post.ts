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

  getPosts(page: number = 1): Observable<PaginatedPosts> {
    return this.http.get<PaginatedPosts>(`${this.baseUrl}/posts?page=${page}`);
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

  getUserPosts(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/posts?page=${page}`);
  }

  updatePost(id: number, data: FormData): Observable<any> {
    data.append('_method', 'PUT');
    return this.http.post(`${this.baseUrl}/posts/${id}`, data);
  }

  archivePost(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${id}`);
  }

  getAdminPostsGrouped(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/posts-by-user`);
  }

  restorePost(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts/${id}/restore`, {});
  }

  deletePostPermanently(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${id}/force`);
  }

  getArchivedPostBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/posts/archived/${slug}`);
  }
}
