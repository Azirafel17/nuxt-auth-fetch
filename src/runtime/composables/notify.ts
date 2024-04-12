import type { AppContext, Ref, VNode } from 'vue'
import { createVNode, render } from 'vue'
import Notify from '../components/Notify.vue'

export interface NotificationQueueItem {
  vm: VNode
}
export type NotificationQueue = NotificationQueueItem[]

export type NotificationTypes = 'success' | 'info' | 'warning' | 'error'

export const notificationTypes: NotificationTypes[] = [
  'success',
  'info',
  'warning',
  'error',
] as const

export type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface NotificationProps {
  title?: string
  message?: string
  offset?: number
  position?: Position
  id?: string
  onClose?: () => void
  duration?: number
  type?: NotificationTypes
}

const notifications: Record<Position, NotificationQueue> = {
  'top-left': [],
  'top-right': [],
  'bottom-left': [],
  'bottom-right': [],
}
export interface NotificationHandle {
  close: () => void
}

export type NotifyFn = (options?: NotificationProps) => NotificationHandle

export interface Notify extends NotifyFn {
  success: NotifyFn
  warning: NotifyFn
  error: NotifyFn
  info: NotifyFn
}

let countIdx = 1
const offset = 16

const notify: NotifyFn & Partial<Notify> & { _context: AppContext | null } =
  function (_options = {}, context: AppContext | null = null) {
    let options: NotificationProps = {}
    if (typeof _options === 'string') {
      options.message = _options
    } else {
      options = { ..._options }
    }
    if (typeof options.message !== 'string') return { close: () => undefined }
    let verticalOffset = options.offset || 0
    const position: Position = options.position || 'top-right'
    notifications[position].forEach(({ vm }) => {
      verticalOffset += vm.el?.offsetHeight || 0
      if (vm.el?.offsetHeight) verticalOffset += offset
    })
    verticalOffset += offset
    const id = `notification_${countIdx++}`

    const preDuration: number = options.message
      ? options.message?.length * 90
      : 7000

    const props: Partial<NotificationProps> = {
      title: options.title,
      message: options.message,
      offset: verticalOffset,
      position,
      id,
      type: options.type,
      onClose: () => {
        close(id, position, options?.onClose)
      },
      duration:
        typeof options.duration === 'undefined'
          ? preDuration < 4000
            ? 4000
            : preDuration
          : options.duration,
    }

    const appendTo: HTMLElement | null = document.body
    const container = document.createElement('div')
    const vm = createVNode(Notify, props)

    vm.appContext = context
    vm.props!.onDestroy = () => {
      render(null, container)
    }

    render(vm, container)
    notifications[position].push({ vm })
    appendTo.appendChild(container.firstElementChild!)

    return {
      close: () => {
        ;(vm.component!.exposed as { visible: Ref<boolean> }).visible.value =
          false
      },
    }
  }
notificationTypes.forEach((type) => {
  notify[type] = (options = {}) => {
    if (typeof options === 'string') {
      options = {
        message: options,
      }
    }
    return notify({
      ...options,
      type,
    })
  }
})

export function close(
  id: string,
  position: Position,
  userOnClose?: (vm: VNode) => void
): void {
  const orientedNotifications = notifications[position]
  const idx = orientedNotifications.findIndex(
    ({ vm }) => vm.component?.props.id === id
  )
  if (idx === -1) return
  const { vm } = orientedNotifications[idx]
  if (!vm) return
  userOnClose?.(vm)

  const removedHeight = vm.el!.offsetHeight
  const verticalPos = position.split('-')[0]
  orientedNotifications.splice(idx, 1)
  const len = orientedNotifications.length
  if (len < 1) return
  for (let i = idx; i < len; i++) {
    const { el, component } = orientedNotifications[i].vm
    const pos = Number.parseInt(el!.style[verticalPos], 10) - removedHeight - 16
    component!.props.offset = pos
  }
}
notify._context = null
export default notify as Notify
