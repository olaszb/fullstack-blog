import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private tokenKey = 'token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  isLoggedIn: boolean;

  constructor(private http: HttpClient) {
    this.isLoggedIn = !!localStorage.getItem(this.tokenKey);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((response: any) => {
        this.saveToken(response.token);
        if (response.user) {
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        this.saveToken(response.token);
        if (response.user) {
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(tap(() => this.clearToken()));
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      })
    );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedIn = true;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn = false;
    this.currentUserSubject.next(null);
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }
}
