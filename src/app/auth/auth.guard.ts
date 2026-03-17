import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const authGuard: CanActivateFn = () => {
    const msalService = inject(MsalService);
    const router = inject(Router);

    const accounts = msalService.instance.getAllAccounts();
    if (accounts.length > 0) {
        return true;
    }

    return router.createUrlTree(['/login']);
};
