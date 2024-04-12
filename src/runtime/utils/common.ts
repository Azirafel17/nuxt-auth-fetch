import notify from '../composables/notify'
import type { ModuleUseRuntimeConfig } from '../types'

export const stringToStringContainer = (
  str: string,
  separator: string = ','
): string[] => {
  return str
    .split(separator)
    .map((item) => item.trim())
    .filter((item) => item.length >= 1)
}

export function getCookieByName(name: string) {
  const cookie = document.cookie
  const output: { [key: string]: string } = {}
  cookie.split(/\s*;\s*/).forEach(function (_pair) {
    const pair = _pair.split(/\s*=\s*/)
    output[pair[0]] = pair.splice(1).join('=')
  })
  return output[`${name}`]
}

const urlValidatorPath = (_path: string): string => {
  return _path.replace(/(\/)\/+/g, '$1')
}
const urlValidator = (_url: string): string => {
  return _url.replace(/([^:]\/)\/+/g, '$1')
}

export const urlPrepare = (_url: string): string => {
  if (_url.lastIndexOf('/') !== _url.length - 1) return urlValidator(`${_url}/`)
  return urlValidator(_url)
}

export const urlPreparePath = (_path: string): string => {
  if (_path.lastIndexOf('/') !== _path.length - 1)
    return urlValidatorPath(`${_path}/`)
  return urlValidatorPath(_path)
}

export const urlPreparePrefix = (_prefix: string): string => {
  if (!_prefix) return ''
  let prefix: string = _prefix
  if (prefix.lastIndexOf('/') === prefix.length - 1) {
    prefix = prefix.slice(prefix.length - 1, prefix.length)
  }
  if (prefix[0].indexOf('/') === 0) {
    prefix = prefix.slice(1, prefix.length)
  }
  return urlValidatorPath(prefix)
}

export const checkConfig = (_confing: ModuleUseRuntimeConfig): boolean => {
  let message: string = ''
  if (!_confing) {
    message = 'aakNuxt is not specified in nuxtConfig - runtimeConfig - public'
  }
  if (!_confing?.fetch) {
    message =
      'fetch is not specified in nuxtConfig - runtimeConfig - public - aakNuxt'
  }

  if (message) {
    notify.error({
      title: 'The aak-nuxt-auth-fetch module is not configured',
      message,
      duration: 0,
    })
    console.error(message)
    return false
  }
  return true
}

export const plagConfig = (): ModuleUseRuntimeConfig => {
  return {
    fetch: {
      baseUrl: '',
      refreshUrl: '',
      loginUrl: '',
      logoutUrl: '',
      prefixPath: '',
      timeout: 0,
    },
    tokenOptions: {
      accessKey: '',
      refreshKey: '',
    },
    authType: 'keycloak',
  }
}
