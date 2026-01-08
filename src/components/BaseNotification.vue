<template>
  <!-- Debug: Component rendered with props -->
  <!-- <div v-if="true" style="position: fixed; top: 100px; right: 10px; background: red; color: white; padding: 5px; z-index: 10000;">
    BaseNotification: show={{ show }}, msg="{{ message }}"
  </div> -->
  
  <!-- Actual notification -->
  <div
    v-show="show"
    class="notification"
    :class="type"
    @click="emit('close')"
  >
    {{ message }}
  </div>
  
  <!-- Debug: Always show version for comparison -->
  <div
    v-if="true"
    class="notification"
    :class="type"
    style="position: fixed; top: 50px; right: 10px; z-index: 9998 !important;"
    @click="emit('close')"
  >
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error'].includes(value)
  }
})

const emit = defineEmits(['close'])
</script>

<style scoped>
.notification {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  z-index: 9999;
  min-width: 320px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.notification.success {
  background: #3f5f57;
  color: #e7f6f1;
}

.notification.error {
  background: #ef4444;
  color: white;
}
</style>
