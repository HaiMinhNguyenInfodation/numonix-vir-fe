import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType } from '@azure/msal-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { msalInstanceFactory } from './auth/auth.config';
import { syncMsalCacheEntryToStorage } from './auth/msal-cache-sync';
import { environment } from '../environments/environment';

export function msalInitializer(msal: IPublicClientApplication): () => Promise<void> {
  return () =>
    msal
      .initialize()
      .then(() => msal.handleRedirectPromise())
      .then((result) => {
        if (result?.account && result?.accessToken) {
          syncMsalCacheEntryToStorage(result);
          return undefined;
        }
        // Fallback: đã đăng nhập (refresh trang, tab khác) — sync từ cache
        const accounts = msal.getAllAccounts();
        if (accounts.length > 0) {
          return msal
            .acquireTokenSilent({ account: accounts[0], scopes: environment.apiScopes })
            .then((silentResult) => syncMsalCacheEntryToStorage(silentResult))
            .catch(() => undefined);
        }
        return undefined;
      })
      .catch(() => {});
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MSAL_INSTANCE,
      useFactory: msalInstanceFactory,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (msalService: MsalService) => msalInitializer(msalService.instance),
      deps: [MsalService],
      multi: true,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        authRequest: { scopes: environment.apiScopes },
        loginFailedRoute: '/unauthorized',
      } as MsalGuardConfiguration,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map<string, string[]>(),
      } as MsalInterceptorConfiguration,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};
