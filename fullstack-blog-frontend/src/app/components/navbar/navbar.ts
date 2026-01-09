import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
constructor(private auth: Auth, private router: Router) {}

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
