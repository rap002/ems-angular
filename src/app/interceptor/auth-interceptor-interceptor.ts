import { HttpInterceptorFn } from '@angular/common/http';

const PUBLIC_ENDPOINTS=["api/v1/auth/login"]

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const url=req.url
  const parent=url.split("/")[5]
  if (!PUBLIC_ENDPOINTS.some(val => val.includes(parent))){//consider reg ex based updation
    const token=sessionStorage.getItem("auth")
    if (token){
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`  // note the space
        }
      });
    }
  }
  return next(req);
};
