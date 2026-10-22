import type { Tone } from '../components/ui'
import type { OrderStatus } from '../data/mock'

export const STATUS_TONE: Record<OrderStatus, Tone> = {
  Paid: 'success',
  Shipped: 'info',
  Pending: 'warning',
  Refunded: 'neutral',
  Failed: 'danger',
}
