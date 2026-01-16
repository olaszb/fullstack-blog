import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Routing {
  constructor(private router: Router) {}

  routeToLogin() {
    this.router.navigateByUrl(`/login`);
  }

  routeToHome() {
    this.router.navigateByUrl(`/`);
  }
}
