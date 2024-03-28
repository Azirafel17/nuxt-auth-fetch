export default {
  experimental: {
    appManifest: false,
  },
  ssr: false,
  modules: ['../src/module'],
  runtimeConfig: {
    public: {
      lamaNuxt: {
        fetch: {
          baseUrl: process.env.VITE_BASE_URL || '',
          refreshUrl: process.env.VITE_REFRESH_URL || '',
          loginUrl: process.env.VITE_LOGIN_URL || '',
          logoutUrl: process.env.VITE_LOGOUT_URL || '',
          prefixPath: process.env.VITE_PREFIX_PATH,
        },
        tokenOptions: {
          accessKey: process.env.VITE_ACCESS_KEY,
          refreshKey: process.env.VITE_REFRESH_KEY,
        },
        authType: 'keycloak', //'keycloak' : 'custom'
        dev: {
          login: VITE_DEV_LOGIN,
          password: VITE_DEV_PASSWORD,
        },
        keycloakOptions: {
          clientId: process.env.VITE_CLIENT_ID,
          clientIdAlias: process.env.VITE_CLIENT_ID_ALIAS,
          exchangeTokenBetweenClientUrl:
            process.env.VITE_EXCHANGE_TOKEN_URL || '',
          useAutoLogin: true,
        },
      },
    },
    secret: {},
  },
  devtools: { enabled: true },
}
