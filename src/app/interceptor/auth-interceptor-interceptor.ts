import { HttpInterceptorFn } from '@angular/common/http';

const PUBLIC_ENDPOINTS=["api/v1/auth/login"]

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const url=req.url
  const parts = url.split("/");
  const parent = parts.length > 5 ? parts[5] : "";
  
  if (!PUBLIC_ENDPOINTS.some(val => val.includes(parent))){
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token=sessionStorage.getItem("auth")
      if (token){
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }
  }
  return next(req);
};
