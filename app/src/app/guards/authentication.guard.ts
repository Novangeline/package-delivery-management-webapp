import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const AuthenticationGuard: CanActivateFn = (route, state) => {
  if (inject(AuthenticationService).isUserAuthenticated()){
    return true
  }
  else {
    inject(Router).navigate(['/login']);
    return false;
  }
};
