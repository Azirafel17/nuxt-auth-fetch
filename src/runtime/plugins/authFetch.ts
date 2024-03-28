import {
  type CookieOptions,
  type CookieRef,
  defineNuxtPlugin,
  useCookie,
  useRuntimeConfig,
  useRequestURL,
} from '#app'
import { computed, reactive, ref, watchEffect } from 'vue'
import { jwtDecode } from 'jwt-decode'
// import paramModule from '#modul-options'
import type {
  RequestOptions,
  isBearer,
  ModuleUseRuntimeConfig,
  Token,
  AvailableClients,
  UserInfoFromToken,
  CookiesToken,
  KeyCloakJWT,
} from '../types'
import notify from '../composables/notify'
import {
  urlPreparePrefix,
  urlPrepare,
  urlPreparePath,
  stringToStringContainer,
} from '../utils/common'

export default defineNuxtPlugin({
  enforce: 'pre', // or 'post'
  async setup(nuxtApp) {
    const runtimeConfig: ModuleUseRuntimeConfig = useRuntimeConfig().public
      .lamaNuxt as ModuleUseRuntimeConfig

    let availableClients: AvailableClients | undefined // доступные клиенты из токена пользователя
    const isAccessAllowedForUser = ref<boolean>(false)
    const userRoleFromToken = ref<string[]>([])
    const userInfoFromToken = ref<UserInfoFromToken>({
      name: '',
      lastName: '',
      fullName: '',
      email: '',
    })

    const optionsModule: Required<ModuleUseRuntimeConfig> = {
      fetch: {
        baseUrl: runtimeConfig.fetch.baseUrl,
        refreshUrl: runtimeConfig.fetch.refreshUrl,
        loginUrl: runtimeConfig.fetch.loginUrl,
        logoutUrl: runtimeConfig.fetch.logoutUrl,
        timeout: runtimeConfig.fetch.timeout || 5000,
        prefixPath: runtimeConfig.fetch.prefixPath || '',
      },
      tokenOptions: {
        accessKey: !runtimeConfig.tokenOptions
          ? 'at'
          : runtimeConfig.authType === 'custom'
          ? runtimeConfig.tokenOptions.accessKey
            ? runtimeConfig.tokenOptions.accessKey
            : 'at'
          : 'atknlma',
        refreshKey: !runtimeConfig.tokenOptions
          ? 'rt'
          : runtimeConfig.authType === 'custom'
          ? runtimeConfig.tokenOptions.refreshKey
            ? runtimeConfig.tokenOptions.refreshKey
            : 'rt'
          : 'rtknlma',
      },
      authType: runtimeConfig.authType || 'custom',
      keycloakOptions: {
        clientIdAlias: runtimeConfig.keycloakOptions?.clientIdAlias
          ? runtimeConfig.keycloakOptions.clientIdAlias ||
            runtimeConfig.keycloakOptions?.clientId ||
            ''
          : '',
        clientId: runtimeConfig.keycloakOptions?.clientId || '',
        exchangeTokenBetweenClientUrl:
          runtimeConfig.keycloakOptions?.exchangeTokenBetweenClientUrl || '',
        useAutoLogin: runtimeConfig.keycloakOptions
          ? runtimeConfig.keycloakOptions.useAutoLogin || false
          : false,
      },
      cookieOptions: {
        maxAge: runtimeConfig.cookieOptions
          ? runtimeConfig.cookieOptions.maxAge || 1800
          : 1800,
        maxAgeForAuthData: runtimeConfig.cookieOptions
          ? runtimeConfig.cookieOptions.maxAgeForAuthData || 2592000
          : 2592000,
        secure: runtimeConfig.cookieOptions
          ? runtimeConfig.cookieOptions.secure || false
          : false,
        sameSite: runtimeConfig.cookieOptions
          ? runtimeConfig.cookieOptions.sameSite || 'lax'
          : 'lax',
        priority: runtimeConfig.cookieOptions
          ? runtimeConfig.cookieOptions.priority || 'high'
          : 'high',
      },
      dev: runtimeConfig.dev || { login: '', password: '' },
    }

    const cookieOptions: CookieOptions = {
      domain: useRequestURL().hostname || 'localhost',
      maxAge: optionsModule.cookieOptions.maxAge,
      secure: optionsModule.cookieOptions.secure,
      sameSite: optionsModule.cookieOptions.sameSite,
      priority: optionsModule.cookieOptions.priority,
      readonly: false,
    }

    const token = reactive<Token | CookiesToken>({
      access: useCookie(optionsModule.tokenOptions.accessKey, {
        ...cookieOptions,
        readonly: false,
      }),
      refresh: useCookie(optionsModule.tokenOptions.refreshKey, {
        ...cookieOptions,
        readonly: false,
      }),
    })

    const authDataCookies = reactive<{ authData: CookieRef<string> }>({
      authData: useCookie('adclma', {
        ...cookieOptions,
        maxAge: optionsModule.cookieOptions.maxAgeForAuthData,
        readonly: false,
      }),
    })

    const extractingDataFromToken = async () => {
      if (optionsModule.authType === 'custom') return
      if (!token.access || !token.refresh) return
      if (token.access.length === 0) return
      const jwtDecodeData = jwtDecode<KeyCloakJWT>(token.access)
      availableClients = {}
      const azp: string = jwtDecodeData.azp || '' //Клиент который выдал токен
      jwtDecodeData.user_group.forEach((client) => {
        let keyGroup: string = ''
        stringToStringContainer(client.substring(1), '/').forEach(
          (item, index) => {
            if (!availableClients) return
            if (index === 0) {
              keyGroup = item
              if (
                (availableClients[item] &&
                  availableClients[item].length === 0) ||
                !availableClients[item]
              ) {
                availableClients[item] = []
              }
            } else {
              availableClients[keyGroup].push(item)
            }
          }
        )
      })

      if (
        optionsModule.keycloakOptions.clientId &&
        availableClients[
          optionsModule.keycloakOptions
            .clientId as keyof typeof availableClients
        ]
      ) {
        // извлекаем из токена данные о пользователе
        userRoleFromToken.value =
          availableClients[
            optionsModule.keycloakOptions
              .clientId as keyof typeof availableClients
          ]

        userInfoFromToken.value.email = jwtDecodeData.email || ''
        userInfoFromToken.value.fullName = jwtDecodeData.name || ''
        userInfoFromToken.value.lastName = jwtDecodeData.family_name || ''
        userInfoFromToken.value.name = jwtDecodeData.given_name || ''
      }

      // проверки на доступ пользователя к клиенту
      if (
        optionsModule.keycloakOptions.clientId &&
        !availableClients[
          optionsModule.keycloakOptions
            .clientId as keyof typeof availableClients
        ]
      ) {
        removeToken()
        notify.warning({
          message: `Доступ в приложение: ${optionsModule.keycloakOptions.clientIdAlias} запрещено `,
        })
        return
      } else if (
        optionsModule.keycloakOptions.clientId &&
        optionsModule.keycloakOptions.clientId !== azp
      ) {
        if (!optionsModule.keycloakOptions.exchangeTokenBetweenClientUrl) {
          return Promise.reject('Не задан URL для обмена токенами')
        }
        await $fetch<typeof token>(
          optionsModule.keycloakOptions.exchangeTokenBetweenClientUrl,
          {
            baseURL: optionsModule.fetch.baseUrl,
            method: 'post',
            retry: 0,
            body: { access: token.access },
          }
        )
          .then((res) => {
            Object.assign(token, res)
          })
          .catch((e) => {
            if (typeof e.data === 'string' && e.data.length > 500) {
              return Promise.reject('Ошибка на сервере')
            }
            return Promise.reject(e)
          })
      }
      isAccessAllowedForUser.value = true
    }

    const isAccessAllowed = computed<boolean>(
      () => isAccessAllowedForUser.value
    )
    const groups = computed<string[]>(() => userRoleFromToken.value)
    const info = computed<UserInfoFromToken>(() => userInfoFromToken.value)
    const isAuth = computed(() => {
      return !!token.access && !!token.refresh
    })

    let tokenPromiseResolve: any
    const tokenReadyPromise = new Promise((resolve) => {
      tokenPromiseResolve = resolve
    })

    const removeToken = () => {
      token.access = undefined
      token.refresh = undefined
    }
    const authReady = tokenReadyPromise
    let tokenRefresh: any = null

    watchEffect(() => {
      extractingDataFromToken().catch((error) => {
        notify.warning({ message: error })
      })
      const watchAuth = ref(isAuth.value)
      tokenPromiseResolve()
    })

    globalThis.$fetch = $fetch.create({
      baseURL:
        urlPrepare(optionsModule.fetch.baseUrl) +
        urlPreparePrefix(optionsModule.fetch.prefixPath),
      timeout: optionsModule.fetch.timeout,
      retryStatusCodes: [401],
      retry: 1,
      onRequest({ options }) {
        const optionsWithIsBearer: typeof options & isBearer = options
        const isBearer: boolean = optionsWithIsBearer.isBearer || false
        if (isBearer) {
          if (!token.access) throw new Error('Нет access токена')
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token.access}`,
          }
        }
        options.headers = {
          ...options.headers,
        }
      },
      async onResponse({ options, response }) {
        if (response.ok) return
        const optionsWithIsBearer: typeof options & isBearer = options
        const isBearer: boolean = optionsWithIsBearer.isBearer || false
        if (
          response.status === 401 &&
          isBearer &&
          options.retry &&
          token.refresh
        ) {
          tokenRefresh ||= $fetch<typeof token>(
            optionsModule.fetch.refreshUrl,
            {
              method: 'post',
              retry: 0,
              body: { refresh: token.refresh },
            }
          )
            .then((data) => {
              Object.assign(token, data)
            })
            .catch(() => removeToken())
            .finally(() => (tokenRefresh = null))
          await tokenRefresh
        } else if (response.status === 401 && !isBearer && response?._data) {
          return Promise.reject(response._data.detail)
        }
      },
      onRequestError({ response }) {
        return Promise.reject(response)
      },
    })

    globalThis.$Post = async <T>(
      apiUrl: string,
      options: RequestOptions
    ): Promise<T> => {
      return await $fetch(urlPreparePath(apiUrl), {
        method: 'POST',
        body: { ...options.data },
        params: { ...options.params },
        isBearer: options.isBearer,
      })
    }
    globalThis.$Get = async <T>(
      apiUrl: string,
      options: RequestOptions
    ): Promise<T> => {
      return await $fetch(urlPreparePath(apiUrl), {
        method: 'GET',
        params: { ...options.params },
        isBearer: options.isBearer,
      })
    }
    globalThis.$Delete = async <T>(
      apiUrl: string,
      options: RequestOptions
    ): Promise<T> => {
      return await $fetch(urlPreparePath(apiUrl), {
        method: 'DELETE',
        body: { ...options.data },
        params: { ...options.params },
        isBearer: options.isBearer,
      })
    }
    globalThis.$Put = async <T>(
      apiUrl: string,
      options: RequestOptions
    ): Promise<T> => {
      return await $fetch(urlPreparePath(apiUrl), {
        method: 'PUT',
        body: { ...options.data },
        params: { ...options.params },
        isBearer: options.isBearer,
      })
    }
    // Базовая авторизация (Предпочтительный вариант)
    const AuthorizationBase = async <
      T extends { access: string; refresh: string }
    >(
      options: RequestOptions
    ): Promise<T | null> => {
      try {
        btoa(options.data.username + ':' + options.data.password)
      } catch (e) {
        return Promise.reject('В логине и пароле не должно быть Кириллицы')
      }
      if (!optionsModule.fetch.loginUrl) {
        return Promise.reject('Не указан URL авторизации')
      }
      await $fetch<T>(urlPreparePath(optionsModule.fetch.loginUrl), {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(
            options.data.username + ':' + options.data.password
          )}`,
        },
      })
        .then((res) => {
          if (
            optionsModule.keycloakOptions.useAutoLogin &&
            (!authDataCookies.authData ||
              (authDataCookies.authData &&
                authDataCookies.authData.length === 0))
          ) {
            const authData = btoa(
              JSON.stringify({
                username: btoa(options.data.username),
                password: btoa(options.data.password),
              })
            )
            Object.assign(authDataCookies, { authData })
          }

          Object.assign(token, res)
        })
        .catch((e) => {
          if (typeof e.data === 'string' && e.data.length > 500)
            return Promise.reject(undefined)
          return Promise.reject(e)
        })

      return token as T
    }

    // Логаут на стороне сервера
    const logoutAPI = async (): Promise<any> => {
      if (!optionsModule.fetch.logoutUrl) {
        return Promise.reject('Не задан URL для logout API')
      }

      return $Post(optionsModule.fetch.logoutUrl, { isBearer: true })
        .then(() => {
          return Promise.resolve('Вы произвели выход')
        })
        .catch((e) => {
          if (typeof e.data === 'string' && e.data.length > 500) {
            return Promise.reject('Ошибка на сервере')
          }
          return Promise.reject(e)
        })
    }

    // Глобальная функция логаута
    const logout = (callback?: () => void) => {
      logoutAPI()
        .then((result) => {
          if (callback) callback()
          notify.success({ message: result })
        })
        .finally(() => {
          removeToken()
          isAccessAllowedForUser.value = false
        })
    }
    // Данные для повторной авто авторизации
    globalThis.$authModule = () => {
      return { authDataCookies, isAccessAllowed }
    }

    // объект для использования в приложении
    globalThis.$useAuthorization = () => {
      return { isAuth, logout, AuthorizationBase, authReady }
    }

    // объект пользователя Лама для использования в приложении
    globalThis.$userLMA = () => {
      return { groups, info }
    }
  },
})
