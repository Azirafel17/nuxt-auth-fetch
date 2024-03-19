<template>
  <Authorization>
    <div>
      <button @click="logoutLocal">Выход</button>
    </div>
    <div>
      <button @click="testAPI">Запрос к защищенной API</button>
    </div>
    <div>Ура я Авторизирован</div>
    <div style="margin-top: 20px; border-top: 1px solid #646464">
      Данные пользователя:
      <pre>{{ info }}</pre>
      Группы пользователя:
      <pre>{{ groups }}</pre>
    </div>
  </Authorization>
</template>

<script setup lang="ts">
import notify from '../src/runtime/composables/notify'

const { info, groups } = $userLMA()
const { isAuth, logout } = $useAuthorization()

// watch(isAuth, async (value) => {
//   if (isAuth.value) {
//     console.log('Я авторизировался')
//   }
// })
const infoCompany = ref()

function testAPI() {
  $Post<string>('demo/check_access/', { isBearer: true })
    .then((res) => {
      notify.success({ message: 'Запрос произведен удачно' })
    })
    .catch((error) => {
      notify.error({ message: error })
    })
}

function logoutLocal() {
  logout()
  infoCompany.value = null
}
</script>
<style>
.main div {
  margin-bottom: 10px;
}
</style>
