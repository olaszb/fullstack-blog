import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { Navbar } from "./pages/navbar/navbar";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, Navbar],
  providers: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fullstack-blog-frontend');

  constructor(private router: Router){}

  showNavbar(): boolean {
    return !['/login', '/register'].includes(this.router.url);
  }
}
