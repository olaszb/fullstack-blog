import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private auth = inject(Auth);
  private router = inject(Router);

  user$ = this.auth.currentUser$;

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.auth.clearToken();
        this.router.navigate(['/']);
      },
    });
  }
}
