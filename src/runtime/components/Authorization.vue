<template>
  <div v-if="!isAuth">
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
const { isAuth } = $useAuthorization()
</script>
<style></style>
