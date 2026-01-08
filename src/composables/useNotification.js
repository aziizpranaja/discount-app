import { ref, watch } from 'vue'

export function useNotification(duration = 3000) {
  const notification = ref({
    show: false,
    message: '',
    type: 'success'
  })

  // Debug: Watch for changes
  watch(notification, (newVal) => {
    // console.log('Notification state changed:', newVal)
  }, { deep: true })

  function showNotification(message, type = 'success') {
    // console.log('showNotification called:', message, type)
    notification.value.message = message
    notification.value.type = type
    notification.value.show = true
    // console.log('After setting show to true:', notification.value)

    setTimeout(() => {
      notification.value.show = false
    }, duration)
  }

  function hideNotification() {
    // console.log('hideNotification called')
    notification.value.show = false
  }

  return {
    notification,
    showNotification,
    hideNotification
  }
}
