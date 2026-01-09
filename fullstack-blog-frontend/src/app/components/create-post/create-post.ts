import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.html',
  imports: [FormsModule],
})
export class CreatePostComponent implements OnInit {
  post = {
    title: '',
    content: '',
    category_id: '',
  };
  imageFile: File | null = null;
  categories: any[] = [];
  loading = false;
  message = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/categories').subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.message = '';

    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    formData.append('category_id', this.post.category_id);

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post('http://127.0.0.1:8000/api/post/create', formData, { headers })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = 'Post created successfully!';
          this.loading = false;
          this.post = { title: '', content: '', category_id: '' };
          this.imageFile = null;

          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to create post.';
          this.loading = false;
        },
      });


  }
}