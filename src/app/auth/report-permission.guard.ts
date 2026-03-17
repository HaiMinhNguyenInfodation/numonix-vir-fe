import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserVerificationService } from './user-verification.service';

/**
 * Guard for routes that require CALL_VIEW (report) permission.
 * Use after authGuard so verification cache is already populated.
 * Redirects to /unauthorized?reason=report when user cannot view reports.
 */
export const reportPermissionGuard: CanActivateFn = () => {
  const verification = inject(UserVerificationService);
  const router = inject(Router);

  const cached = verification.getCachedResult();
  if (!cached?.canViewReports) {
    return router.createUrlTree(['/unauthorized'], { queryParams: { reason: 'report' } });
  }
  return true;
};
