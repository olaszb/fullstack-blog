import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection,
  provideAppInitializer, inject
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { Auth } from './services/auth';
import { tap, of, catchError } from 'rxjs';



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideAppInitializer(() => {
      const authService = inject(Auth);
      const token = authService.getToken();

      if (token) {
        return authService.getProfile().pipe(
          catchError((error) => {
            authService.clearToken();
            return of(null);
          })
        );
      }
      
      return of(null);
    })
  ]
};
