import { HttpInterceptorFn } from '@angular/common/http';

// Reserved for future parent-app HTTP interceptor needs.
export const authBridgeInterceptor: HttpInterceptorFn = (req, next) => next(req);
