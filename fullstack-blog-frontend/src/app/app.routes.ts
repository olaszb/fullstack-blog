import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { privateGuard } from './guards/private-guard';
import { RegisterComponent } from './components/register/register';
import { publicGuard } from './guards/public-guard';
import { HomeComponent } from './components/home/home';
import { Redirect } from './components/redirect/redirect';

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
