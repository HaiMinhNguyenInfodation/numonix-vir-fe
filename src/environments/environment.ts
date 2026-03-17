export const environment = {
    production: true,
    msalConfig: {
        clientId: '459e40d6-e96a-4c4e-833f-f43bd5d71885',
        authority: 'https://login.microsoftonline.com/967731f1-e365-496e-b378-fcb5b0c71157',
        redirectUri: 'https://lemon-grass-08f65b200.4.azurestaticapps.net',
        postLogoutRedirectUri: 'https://lemon-grass-08f65b200.4.azurestaticapps.net',
    },
    apiScopes: ['openid', 'profile', 'email'],
    authBridge: {
        sessionApiUrl: 'https://api.your-production-domain.com/api/session',
        iframeAppOrigin: 'https://polite-smoke-0a7b92d00.1.azurestaticapps.net',
        apiKey: 'fd3e68ea-3816-4eed-97cb-3e2aae802edd',
    },
};
