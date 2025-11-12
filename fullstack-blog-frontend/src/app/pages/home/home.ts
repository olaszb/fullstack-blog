import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
})
export class HomeComponent {
  constructor(private auth: Auth, private router: Router) {}

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
