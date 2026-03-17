import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

/**
 * Guard that only requires an MSAL account (no Numonix verification).
 * Use for /verifying so the user sees the verification loading page before redirect.
 */
export const msalAccountGuard: CanActivateFn = () => {
  const msalService = inject(MsalService);
  const router = inject(Router);

  if (msalService.instance.getAllAccounts().length > 0) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
