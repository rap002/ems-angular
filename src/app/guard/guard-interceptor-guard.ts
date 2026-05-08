import { CanActivateFn } from '@angular/router';

export const guardInterceptorGuard: CanActivateFn = (route, state) => {
  return true;
};
