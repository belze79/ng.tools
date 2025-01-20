import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService)
    const router = inject(Router)
  
    if(authService.isValidAuth('ADMIN')){
      return true
    }
    router.navigate(['/login'])
    return false
};
