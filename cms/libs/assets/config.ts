export const config = {
  authType: 'OIDC AzureAD',
  oidc: {
    sendAccessToken: true,
    authority:
      'https://login.microsoftonline.com/d5cf2436-2b1a-4c0e-b62b-a4c844d46878/v2.0',
    authWellknownEndpointUrl:
      'https://login.microsoftonline.com/d5cf2436-2b1a-4c0e-b62b-a4c844d46878/v2.0',
    clientId: '7a16a1a6-56de-4dc0-91c1-65b34a60ea8d',
    scope:
      'openid profile offline_access email api://8d414121-0381-4b6a-b8db-6ef60cb42bba/access_as_user',
    responseType: 'code',
    silentRenew: true,
    maxIdTokenIatOffsetAllowedInSeconds: 600,
    issValidationOff: true,
    autoUserInfo: false,
    useRefreshToken: true,
    logLevel: 'Debug',
    secureRoutes: ['https://ca-api.speridian.com'],
  },
};
