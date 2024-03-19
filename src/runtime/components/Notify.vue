<template>
  <transition
    name="fade"
    @before-leave="onClose"
    @after-leave="$emit('destroy')"
  >
    <div
      v-show="visible"
      :id="id"
      class="notification"
      :class="[type]"
      :style="positionStyle"
      @click="close"
    >
      <h2 :class="'title'" v-text="title" />
      <div v-show="message" :style="!!title ? undefined : { margin: 0 }">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import type { CSSProperties } from 'vue'
import { ref, computed, onMounted } from 'vue'

const props = defineProps([
  'message',
  'offset',
  'id',
  'onClose',
  'duration',
  'onDestroy',
  'position',
  'title',
  'type',
])
const visible = ref(false)

const verticalProperty = computed(() =>
  props.position.startsWith('top') ? 'top' : 'bottom'
)

const horizontalClass = computed(() =>
  props.position.endsWith('right') ? 'right' : 'left'
)

const positionStyle = computed<CSSProperties>(() => {
  return {
    [verticalProperty.value]: `${props.offset}px`,
    [horizontalClass.value]: `16px`,
    zIndex: 2030,
  }
})

let timer: (() => void) | undefined = undefined

function startTimer() {
  if (props.duration > 0) {
    ;({ stop: timer } = useTimeoutFn(() => {
      if (visible.value) close()
    }, props.duration))
  }
}

function close() {
  visible.value = false
  props.onClose()
}

onMounted(() => {
  startTimer()
  visible.value = true
})
</script>
<style scoped>
@import url('../assets/css/moduleNotify.css');
</style>
