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
        },
        tokenSetting: {
          accessKey: process.env.VITE_ACCESS_KEY || '',
          refreshKey: process.env.VITE_REFRESH_KEY || '',
        },
        authType: 'keycloak', //'keycloak' : 'custom'
        dev: {
          login: 'yardmanagement',
          password: 'testUser',
        },
        keycloakSetting: {
          clientId: 'service-yard-management',
          clientIdAlias: 'Управление двором',
          exchangeTokenBetweenClientUrl:
            process.env.VITE_EXCHANGE_TOKEN_URL || '',
        },
      },
    },
    secret: {},
  },
  devtools: { enabled: true },
}
