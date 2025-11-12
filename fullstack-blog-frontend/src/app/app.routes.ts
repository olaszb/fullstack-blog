import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { privateGuard } from './guards/private-guard';
import { RegisterComponent } from './pages/register/register';
import { publicGuard } from './guards/public-guard';
import { HomeComponent } from './pages/home/home';
import { Redirect } from './pages/redirect/redirect';

export const routes: Routes = [
    {
        path: '',
        component: Redirect,
        pathMatch: 'full',
    },
    {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent,
        canActivate: [publicGuard],
    },
    {
        path: 'register',
        pathMatch: 'full',
        component: RegisterComponent,
        canActivate: [publicGuard],
    },
    {
        path: 'home',
        pathMatch: 'full',
        component: HomeComponent,
        canActivate: [privateGuard],
    },
];
