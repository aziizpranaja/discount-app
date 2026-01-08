export const DISCOUNT_TYPES = {
  PERCENT: 'percent',
  RUPIAH: 'rupiah'
} as const

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const

export const DELETE_MODES = {
  SINGLE: 'single',
  BULK: 'bulk'
} as const

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
} as const

export interface Discount {
  _id: string
  discount_name: string
  discount: string
}

export interface DiscountFormData {
  name: string
  value: string
  type: string
}

export interface DiscountErrors {
  name: boolean
  nameDuplicate: boolean
  value: boolean
}

export interface NotificationState {
  show: boolean
  message: string
  type: string
}

export interface SortState {
  key: string
  order: string
}

export type DiscountType = typeof DISCOUNT_TYPES[keyof typeof DISCOUNT_TYPES]
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]
export type DeleteMode = typeof DELETE_MODES[keyof typeof DELETE_MODES]
export type SortOrder = typeof SORT_ORDERS[keyof typeof SORT_ORDERS]
