<template>
  <div v-if="!isAuth"><AuthModulForm /></div>
  <div v-else><slot></slot></div>
</template>

<script setup lang="ts">
import AuthModulForm from './AuthModulForm.vue'
const { isAuth } = $useAuthorization()
</script>
<style></style>
