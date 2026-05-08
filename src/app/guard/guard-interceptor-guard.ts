import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { isLoggedIn } from '../service/auth/auth-service';

export const guardInterceptorGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // If running on server, allow activation so client can handle auth check with sessionStorage
  if (isPlatformServer(platformId)) {
    return true;
  }

  if (isLoggedIn()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
