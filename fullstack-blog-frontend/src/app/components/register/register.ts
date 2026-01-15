import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: true,
  imports: [FormsModule, RouterLink],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  error = '';
  loading = false;

  constructor(private auth: Auth, private router: Router) {}

  onSubmit(): void {
    if (this.password !== this.password_confirmation) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.error = '';
    this.loading = true;

    this.auth
      .register({
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Registration failed. Email might be taken.';
          console.error(err);
        },
      });
  }
}
