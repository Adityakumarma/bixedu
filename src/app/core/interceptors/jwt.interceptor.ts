import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const token = storageService.getToken();
  const user = storageService.getUser<any>();

  let headers = req.headers;

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  if (user && user.centreId) {
    headers = headers.set('X-Centre-ID', user.centreId);
  }

  const clonedReq = req.clone({ headers });
  return next(clonedReq);
};
