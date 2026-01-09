import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
import { Routing } from '../services/routing';
import { inject } from '@angular/core';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);

  if(authService.isLoggedIn){
    inject(Routing).routeToLogin();
  }

  return !authService.isLoggedIn;
};
