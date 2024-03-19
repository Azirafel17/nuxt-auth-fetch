import { fileURLToPath } from 'url'
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addComponent,
  addImports,
  addTemplate,
} from '@nuxt/kit'
import type { ModuleUseRuntimeConfig } from './runtime/types'

export default defineNuxtModule<ModuleUseRuntimeConfig>({
  meta: {
    name: '@lama-nuxt-auth-fetch',
    configKey: 'LamaNuxtAuthFetch',
    compatibility: {
      nuxt: '^3.7.0',
    },
  },
  setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    const { resolve } = createResolver(import.meta.url)
    // для получения параметров при импорте модуля в приложение
    nuxt.options.alias['#modul-options'] = addTemplate({
      filename: 'modul-options.mjs',
      getContents() {
        return `export default ${JSON.stringify(options)}`
      },
    }).dst

    // Импортируем плагин в контекст
    addPlugin({
      mode: nuxt.options.ssr ? 'all' : 'client',
      src: resolve('./runtime/plugins/authFetch'),
    })

    // Импортируем компоненты в контекст
    addComponent({
      name: 'Authorization',
      filePath: resolve(runtimeDir, 'components', 'Authorization.vue'),
    })
    // Импортируем из композибл useAuth в контекст
    addImports({
      as: 'useAuth',
      from: resolve(runtimeDir, 'composables'),
      name: 'useAuth',
    })
  },
})
