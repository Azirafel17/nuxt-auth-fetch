
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D) ![Nuxtjs](https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=#00DC82) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

# aak-nuxt-auth-fetch ✌😺

### Additionally 😀
If you use **Swagger** on your the backend, then you can use the **[aak-swagger-typescript-api](https://www.npmjs.com/package/aak-swagger-typescript-api)** package to automatically generate types and classes for interaction in the backend 

## 📦 Get Started

1. Install  **`aak-nuxt-auth-fetch`** as project dependency✨

```bash
# Using pnpm
pnpm add aak-nuxt-auth-fetch

# Using yarn
yarn add aak-nuxt-auth-fetch

# Using npm
npm install aak-nuxt-auth-fetch
```
1. Add it to the modules section of your **`nuxt.config.ts`**:✨

```js
  modules: [
    ['aak-nuxt-auth-fetch'],
  ],
```

2. Add a block for **`aak-nuxt-auth-fetch`** to your **`nuxt.config.ts`** `runtimeConfig ✨

```js
export default defineNuxtConfig({
  experimental: {
    appManifest: false,
  },
  ssr: false,
  runtimeConfig: {
    public: {
      aakNuxt: {
        fetch: {
          baseUrl: process.env.VITE_BASE_URL || '',
          refreshUrl: process.env.VITE_REFRESH_URL || '',
          loginUrl: process.env.VITE_LOGIN_URL || '',
          logoutUrl: process.env.VITE_LOGOUT_URL || '',
          timeout: process.env.VITE_TIMEOUT,
        },
        tokenOptions: {
          accessKey: process.env.VITE_ACCESS_KEY || '',
          refreshKey: process.env.VITE_REFRESH_KEY || '',
        },
        authType: 'keycloak', // 'keycloak' | 'custom'
        dev: { // optional setting
          login: 'login',
          password: 'password',
        },
        keycloakOptions: {
          clientId: process.env.VITE_CLIENT_ID || '',
          clientIdAlias: process.env.VITE_CLIENT_ID_ALIAS || '',
          exchangeTokenBetweenClientUrl:
            process.env.VITE_EXCHANGE_TOKEN_URL || '',
        },
        cookieOptions:{ // optional setting
          maxAge: process.env.VITE_COOKIE_MAX_AGE,
          secure: process.env.VITE_COOKIE_SECURE,
          sameSite: process.env.VITE_COOKIE_SAME_SITE,
          priority: process.env.VITE_COOKIE_PRIORITY,
        },
      },
      authDev: false,
    },
  },
})
```

Description of the blocks:
+ **fetch** (required ☝)
  - ***baseUrl*** **: string** - the base URL for fetch
  - ***refreshUrl*** **: string** - The URL for refresh the token
  - ***loginUrl*** **: string** - Login URL
  - ***logoutUrl*** **: string** - logout URL
  - ***prefixPath*** **: string** - Path prefix (optional, default value '') exemple: 'api'
<br/>

+ **tokenOptions** (optional, used only for AuthType: ***custom***)
  - ***accessKey*** **: string** - key for access token (default value **at**)
  - ***refreshKey*** **: string** - key for refresh token (default value **rt**)
<br/>

+ **authType** **: 'keycloak' | 'custom'** (optional, default value **custom**)
  - ***keycloak*** - There is a memorization of the username and password until the user logs out
  - ***custom*** - The $userLMA() functions are not available in this mode
<br/>

+ **keycloakOptions** (optional if ***AuthType === keycloak***)
  - ***clientId*** **: string** - Client ID in keycloak ☝
  - ***clientIdAlias*** **: string** - Alias for the client's ID (optional, default value **clientId**)
  - ***exchangeTokenBetweenClientUrl*** **: string** - URL for token exchange between clients ☝
  - ***useAutoLogin*** **: boolean** - Allows you to log in automatically if the refresh token is expired
<br/>

+ **cookieOptions** (optional)
  - ***maxAge*** **: number** - default value **1800** - 30 min
  - ***maxAgeForAuthData*** **: number** - default value **2592000** - 30 days
  - ***secure*** **: boolen** - default value **false**
  - ***sameSite*** **: 'strict' | 'lax' | 'none'** - default value **'lax'**
  - ***priority*** **: 'low' | 'medium' | 'high'** - default value **'high'**
  
  <br />
+ **authDev** (optional)**: boolean | undefind**
  - If this parameter is set to **true**, the authorization check in the module is disabled


## Сapability 🤘🚀
#### Custom fetch:
##### You can use the following global functions:
```js
  $post<Return type/interface>('api_path',{ data, isBearer: true })
  $get<Return type/interface>('api_path',{ params, isBearer: true })
  $put<Return type/interface>('api_path',{ data, isBearer: true })
  $delete<Return type/interface>('api_path',{ data, isBearer: true })
```
Where **isBearer** is a required attribute

#### Authorization:
##### The *\<Authorization>* component for use in \<template>:
```js
<template>
  <Authorization>
    <template #logo>Your Logo</template>
    Your APP
  </Authorization>
</template>
```
##### You can use the following global functions and ref variables:
```js
  // Authorization, available in all AuthType modes
  const { isAuth, logout } = $useAuthorization()

  // The sign of user authorization
  isAuth: ComputedRef<boolean> 
  watch(isAuth, async (value) => {
    if (value) {
      console.log('I logged in')
    }
  })

  // Logout function, can accept callback
  logout: (callback?: () => void) => void 

  // User data, available only in AuthType mode === 'keycloak'
  const { info, groups } = $userLMA()

  // info - Information about the user from the SSO service, has the following interface:
  interface UserInfoFromToken {
    name: string
    lastName: string
    fullName: string
    email: string
  } 

  // groups - The user's groups in the current service, has the following type:
  groups: string[]

```

### If everything worked out, well done! 🎉

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```
