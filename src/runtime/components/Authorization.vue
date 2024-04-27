<template>
  <div v-if="config.public.authDev ? !config.public.authDev : !isAuth">
    <AuthModulForm>
      <template #logo>
        <slot name="logo"></slot>
      </template>
    </AuthModulForm>
  </div>
  <div v-else><slot></slot></div>
</template>

<script setup lang="ts">
import AuthModulForm from './AuthModulForm.vue'
import { useRuntimeConfig } from '#app'
const { isAuth } = $useAuthorization()
const config = useRuntimeConfig()
</script>
<style></style>
