import { HttpInterceptorFn } from '@angular/common/http';
import { getAuthToken } from '../service/auth/auth-service';

const PUBLIC_ENDPOINTS=["api/v1/auth/login"]

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;
  const isPublic = PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
  
  if (!isPublic) {
    const token = getAuthToken();
    if (token) {
      console.log(`Attaching token to: ${url}`);
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.warn(`No token found in storage for: ${url}`);
    }
  }
  return next(req);
};
