
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D) ![Nuxtjs](https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=#00DC82) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

# lama-nuxt-auth-fetch ✌😺

## Установка

1. Добавить **`lama-nuxt-auth-fetch`** в зависимости своего проекта ✨

```bash
# Using pnpm
pnpm add lama-nuxt-auth-fetch

# Using yarn
yarn add lama-nuxt-auth-fetch

# Using npm
npm install lama-nuxt-auth-fetch
```
1. Добавить модуль в зависимости Nuxt в твой **`nuxt.config.ts`** ✨

```js
  modules: [
    ['lama-nuxt-auth-fetch'],
  ],
```

2. Добавить блок для **`lama-nuxt-auth-fetch`** в твой **`nuxt.config.ts`** `runtimeConfig` ✨

```js
export default defineNuxtConfig({
  experimental: {
    appManifest: false,
  },
  ssr: false,
  runtimeConfig: {
    public: {
      lamaNuxt: {
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
        authType: 'keycloak', //'keycloak' | 'custom'
        dev: { // не обязательная настройка
          login: 'login',
          password: 'password',
        },
        keycloakOptions: {
          clientId: process.env.VITE_CLIENT_ID || '',
          clientIdAlias: process.env.VITE_CLIENT_ID_ALIAS || '',
          exchangeTokenBetweenClientUrl:
            process.env.VITE_EXCHANGE_TOKEN_URL || '',
        },
        cookieOptions:{ // не обязательная настройка
          maxAge: process.env.VITE_COOKIE_MAX_AGE,
          secure: process.env.VITE_COOKIE_SECURE,
          sameSite: process.env.VITE_COOKIE_SAME_SITE,
          priority: process.env.VITE_COOKIE_PRIORITY,
        },
      },
    },
  },
})
```

Описание блоков:
+ **fetch** (обязательные ☝)
  - ***baseUrl*** - базовый Url для fetch
  - ***refreshUrl*** - Url для обновления токена
  - ***loginUrl*** - Url для получения токена
  - ***logoutUrl*** - Url для разлогинивания
<br/>

+ **tokenOptions** (опционально, используется только для authType: ***custom***)
  - ***accessKey*** - ключь для access token (default value **at**)
  - ***refreshKey*** - ключь для refresh token (default value **rt**)
<br/>

+ **authType** (опционально default value **custom**)
  - Возможные значения ***keycloak*** / ***custom***
  - ***keycloak*** - Присутствует запоминание логина и пароля до момента выхода пользователя
  - ***custom*** - В этом режиме не достпны функции $userLMA()
<br/>

+ **keycloakOptions** (опционально если ***authType === keycloak***)
  - ***clientId*** - Id клиента в keycloak ☝
  - ***clientIdAlias*** - Человеко понятный алиас для Id клиента (Опционально, default value **clientId**)
  - ***exchangeTokenBetweenClientUrl*** - Url для обмена токена между клиентами ☝
<br/>

+ **cookieOptions** (опционально)
  - ***maxAge*** - default value **1800** - 30 минут
  - ***maxAgeForAuthData*** - default value **2592000** - 30 дней
  - ***secure*** - default value **false**
  - ***sameSite*** - default value **'lax'**
  - ***priority*** - default value **'high'**

## Возможности 🤘🚀
#### Кастомный fetch:
##### Досупные следующие глобальные функции:
```js
  $Post<Return type/interface>('api url',{ data, isBearer: true })
  $Get<Return type/interface>('api url',{ params, isBearer: true })
  $Put<Return type/interface>('api url',{ data, isBearer: true })
  $Delete<Return type/interface>('api url',{ data, isBearer: true })

  где isBearer - обязательный атрибут
```

#### Авторизация:
##### Компонент \<Authorization> для работы:
```js
<template>
  <Authorization>
    <template #logo>Your Logo</template>
    Your APP
  </Authorization>
</template>
```
##### Досупные следующие глобальные функции и объекты:
```js
  //@ Авторизация, доступна во всех режимах authType
  const { isAuth, logout } = $useAuthorization()

  isAuth: ComputedRef<boolean> // Признак авторизации полльзователя
  watch(isAuth, async (value) => {
    if (value) {
      console.log('Я авторизировался')
    }
  })

  logout: (callback?: () => void) => void // Функция выхода из системы, может принимать callBack

  //@ Данные пользователя, доступны только в режиме authType === 'keycloak'
  const { info, groups } = $userLMA()

  info - Инфо о пользователе из сервиса SSO, имеет следующий интерфейс:
    interface UserInfoFromToken {
      name: string
      lastName: string
      fullName: string
      email: string
    } 

  groups - Группы пользователя в текущем сервисе, имеет следующий тип:
    string[]

```

### Если все получилось, молодец! 🎉

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
