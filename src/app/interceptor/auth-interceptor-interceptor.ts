import { HttpInterceptorFn } from '@angular/common/http';

const PUBLIC_ENDPOINTS=["api/v1/auth/login"]

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;
  const isPublic = PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
  
  if (!isPublic) {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem("auth");
      if (token) {
        console.log(`Attaching token to: ${url}`);
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        console.warn(`No token found in sessionStorage for: ${url}`);
      }
    }
  }
  return next(req);
};
