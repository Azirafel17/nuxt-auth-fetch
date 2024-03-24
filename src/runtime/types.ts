import { RemovableRef } from '@vueuse/core'
import { CookieRef } from 'nuxt/dist/app/composables/cookie'
import type { ComputedRef } from 'vue'

export interface UserInfoFromToken {
  name: string
  lastName: string
  fullName: string
  email: string
}

declare global {
  function $Post<T>(apiUrl: string, options: RequestOptions): Promise<T>
  function $Get<T>(apiUrl: string, options: RequestOptions): Promise<T>
  function $Put<T>(apiUrl: string, options: RequestOptions): Promise<T>
  function $Delete<T>(apiUrl: string, options: RequestOptions): Promise<T>
  function $useAuthorization(): {
    isAuth: ComputedRef<boolean>
    authReady: Promise<unknown>
    AuthorizationBase: (
      options: RequestOptions
    ) => Promise<{ access: string; refresh: string } | null>
    Authorization: (
      options: RequestOptions
    ) => Promise<{ access: string; refresh: string } | null>
    logout: (callback?: () => void) => void
  }
  function $userLMA(): {
    groups: ComputedRef<string[]>
    info: ComputedRef<UserInfoFromToken>
  }
  function $authModule(): {
    authDataCookies: { authData: string }
    isAccessAllowed: ComputedRef<boolean>
    userName: ComputedRef<string>
  }
}

export interface ModuleExportFunctions {
  $Post<T>(apiUrl: string, options: RequestOptions): Promise<T>
  $Delete<T>(apiUrl: string, options: RequestOptions): Promise<T>
  $Put<T>(apiUrl: string, options: RequestOptions): Promise<T>
  $Get<T>(apiUrl: string, options: RequestOptions): Promise<T>
  $useAuthorization(): {
    isAuth: ComputedRef<boolean>
    authReady: Promise<unknown>
    AuthorizationBase: (
      options: RequestOptions
    ) => Promise<{ access: string; refresh: string } | null>
    Authorization: (
      options: RequestOptions
    ) => Promise<{ access: string; refresh: string } | null>
    logout: (callback?: () => void) => void
  }
  $userLMA(): {
    groups: ComputedRef<string[]>
    info: ComputedRef<UserInfoFromToken>
  }
  $authModule(): {
    authDataCookies: { authData: ComputedRef<string> }
    isAccessAllowed: ComputedRef<boolean>
    userName: ComputedRef<string>
  }
}

// @ts-ignore
declare module 'vue/types/vue' {
  interface Vue {
    $auth: ModuleExportFunctions
  }
}

interface PluginInjection {
  $auth: ModuleExportFunctions
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends PluginInjection {}
}

/***************************/
export interface isBearer {
  isBearer?: boolean
}

export interface StrAnyObj {
  [key: string]: any
}

export interface RequestOptions {
  isBearer?: boolean
  params?: StrAnyObj
  data?: any
}
export interface Tokens {
  access: string | null
  refresh: string | null
}

export interface isBearer {
  isBearer?: boolean
}

export type AuthType = 'keycloak' | 'custom'
export type StorageType = 'localStorage' | 'cookie'

export interface ModuleUseRuntimeConfig {
  fetch: {
    baseUrl: string
    refreshUrl: string
    loginUrl: string
    logoutUrl?: string
    timeout?: number
  }
  tokenSetting?: {
    accessKey: string
    refreshKey: string
  }
  authType: AuthType
  // basic - базовая аутентификация
  // body - отправляет в body username / password
  authFetchType?: 'basic' | 'body'
  // если authType === keycloak, storageType должен быть
  // cookie иначе не будет работать межклиентское общение
  storageType: StorageType
  keycloakSetting?: {
    clientId: string
    clientIdAlias: string
    // Сюда отправляем access токен когда переходим с
    // клиента на клиента, для получения пары токенов
    exchangeTokenBetweenClientUrl: string
  }
  dev?: {
    login: string
    password: string
  }
}

export interface AuthData {
  username: string
  password: string
}

export interface Token {
  access: RemovableRef<string>
  refresh: RemovableRef<string>
}
export interface CookiesToken {
  access: CookieRef<string>
  refresh: CookieRef<string>
}

export interface CustomAuth {
  storageType?: StorageType
  loginUrl?: string
  logoutUrl?: string
  refreshUrl?: string
}

export interface Keycloak extends CustomAuth {
  clientId?: string
  exchangeTokenBetweenClientUrl?: string
}

type UserGrops = string

export interface AvailableClients {
  [key: string]: UserGrops[]
}

export interface RealmAccess {
  roles: string[]
}
export interface ResourceAccess {
  account: RealmAccess
}

export interface KeyCloakJWT {
  exp: number
  iat: number
  jti: String
  // realm
  iss: string
  aud: string[]
  // id user in keycloak
  sub: string
  typ: string
  // how own token
  azp: string
  // session id
  session_state: string
  acr: string
  'allowed-origins': string[]
  realm_access: RealmAccess
  resource_access: ResourceAccess
  scope: string
  sid: string
  user_group: string[]
  email_verified: boolean
  name: string
  preferred_username: string
  given_name: string
  family_name: string
  email: string
}
