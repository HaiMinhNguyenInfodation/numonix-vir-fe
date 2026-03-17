import { BrowserCacheLocation, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

export function msalInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: environment.msalConfig.clientId,
            authority: environment.msalConfig.authority,
            redirectUri: environment.msalConfig.redirectUri,
            postLogoutRedirectUri: environment.msalConfig.postLogoutRedirectUri,
        },
        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
        },
        system: {
            loggerOptions: {
                logLevel: LogLevel.Warning,
                piiLoggingEnabled: false,
            },
        },
    });
}
