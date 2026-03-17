import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { map } from 'rxjs/operators';
import { UserVerificationService } from './user-verification.service';

export const authGuard: CanActivateFn = () => {
  const msalService = inject(MsalService);
  const router = inject(Router);
  const verification = inject(UserVerificationService);

  const accounts = msalService.instance.getAllAccounts();
  if (accounts.length === 0) {
    return router.createUrlTree(['/login']);
  }

  return verification.verify().pipe(
    map((result) => {
      if (!result.allowed) {
        return router.createUrlTree(['/unauthorized']);
      }
      // Reports route: allow access; IframeContainer shows no-permission message in main context when !canViewReports
      return true;
    })
  );
};
