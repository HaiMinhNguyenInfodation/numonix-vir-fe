export const environment = {
    production: true,
    msalConfig: {
        clientId: '459e40d6-e96a-4c4e-833f-f43bd5d71885',
        authority: 'https://login.microsoftonline.com/967731f1-e365-496e-b378-fcb5b0c71157',
        redirectUri: 'https://tcx-insight.teamscx.com/',
        postLogoutRedirectUri: 'https://tcx-insight.teamscx.com/login',
    },
    apiScopes: ['openid', 'profile', 'email'],
    authBridge: {
        sessionApiUrl: 'https://api.your-production-domain.com/api/session',
        iframeAppOrigin: 'https://polite-smoke-0a7b92d00.1.azurestaticapps.net',
        apiKey: 'fd3e68ea-3816-4eed-97cb-3e2aae802edd',
    },
    numonixVerification: {
        apiBaseUrl: 'https://openapi.de.numonix.cloud',
        tenantId: '45991070-7dba-4e53-bcdb-ed9240da3767',
        nToken: 'eyJpZCI6ImE5OGJmYjM4LTY1NzItNGZlZS1iNzI5LTkxM2VmNDRkZTIyOSIsImVuZHBvaW50IjoiaHR0cHM6Ly9hcGkuZGUubnVtb25peC5jbG91ZC93ZWJhcGkvIiwidGVuYW50SWQiOiI0NTk5MTA3MC03ZGJhLTRlNTMtYmNkYi1lZDkyNDBkYTM3NjciLCJwdWJsaWNLZXkiOiItLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLVxyXG5NSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQTBkVWlHd3g4cVdOQXZqbmI4OUIzXHJcblliT01zaUR5Qlk5YnpVbCtybjBpTEUyeVUyN0ZYZ2Y4cnVoNHQxcVdkYUcwOGxmMGg4WmljODl1UThEVnVRNU5cclxuM0xoTXVabFczNTNkWm5BZDBBdHgzK1h4SGhGaDgvQzRNN2xiWmxhNm16ak9lK3Y1WGRCNEpyaTl5Y25JVjFha1xyXG44Y2pxTEcxQ3JqcTV6bC8zaWNXM0J1UkFBM0E0THhjY21Fb0J0N250bFhwNVRkODB3VzhkUVFWRGo3SWdIeXo5XHJcbnJYYitIbC84WHRVWGxlQ1pVWDExd2dMRyt0dVArUjR5MG5pd1RBd2w5QTlVQU8rRUVkckR5RGtrK1Q2M01pNnBcclxua3M4bWN0SVVNWVdiVzNXcEQwQ0pLQUJzd1E1bHJ1V3kySDQxb2lnUDVGeDh4a0t0bTZRb1U5WmZTTmtUaHhCN1xyXG4wUUlEQVFBQlxyXG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iLCJ0eXBlIjoyLCJzdWJUeXBlIjpudWxsfQ==',
    },
};
