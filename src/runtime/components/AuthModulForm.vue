<template>
  <div class="module-auth-main">
    <div class="module-auth-logo">
      <slot name="logo"></slot>
    </div>
    <form class="module-auth" @submit.prevent.stop="login">
      <div class="auth-input__wrapper">
        <input
          class="auth-input"
          v-model="authForm.username"
          type="text"
          name="Логин"
          placeholder="Логин"
          maxlength="30"
        />
      </div>
      <div class="auth-input__wrapper">
        <input
          class="auth-input"
          v-model="authForm.password"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          placeholder="Пароль"
          maxlength="40"
        />
        <span
          class="button-show-password"
          @click="showPassword = !showPassword"
        >
          <CloseEye v-if="!showPassword" />
          <OpenEye v-else />
        </span>
      </div>
      <button class="button-login">Войти</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { AuthData } from '../types'
import { reactive, ref } from 'vue'
import notify from '../composables/notify'
import CloseEye from './CloseEye.vue'
import OpenEye from './OpenEye.vue'

const authForm = reactive<AuthData>({
  username: '',
  password: '',
})
const { authDataCookies, isAccessAllowed, optionsModule } = $authModule()
const { isAuth, AuthorizationBase } = $useAuthorization()
const showPassword = ref<boolean>(false)
const login = () => {
  AuthorizationBase({
    data: {
      username: authForm.username.trim(),
      password: authForm.password.trim(),
    },
    isBearer: false,
  })
    .then(() => {
      notify.success({ message: '👍 Вы успешно авторизовались' })
    })
    .catch((e) => {
      let error: string = ''
      if (e && typeof e !== 'string' && e.data) {
        error = e.data.detail
      } else if (e && typeof e === 'string') {
        error = e
      } else {
        error = 'Ошибка на сервере, обратитесь к администратору системы'
      }
      notify.warning({ message: '❗ ' + error })
    })
}
if (optionsModule?.dev) {
  authForm.username = optionsModule.dev.login
  authForm.password = optionsModule.dev.password
} else if (
  optionsModule.authType === 'keycloak' &&
  optionsModule.keycloakOptions &&
  optionsModule.keycloakOptions.useAutoLogin &&
  authDataCookies.authData
) {
  const autData = JSON.parse(atob(authDataCookies.authData)) as AuthData
  authForm.username = atob(autData.username)
  authForm.password = isAccessAllowed.value ? atob(autData.password) : ''
  if (!isAuth.value && isAccessAllowed.value) login()
}
</script>

<style>
@import url('../assets/css/moduleStyle.css');
</style>
