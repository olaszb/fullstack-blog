import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { PostsComponent } from "../posts/posts";

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [PostsComponent],
})
export class HomeComponent {
  
}
