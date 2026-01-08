<template>
  <div class="modal-overlay" @click="emit('cancel')">
    <div class="confirm-modal" @click.stop>
      <h3>Hapus Diskon</h3>
      
      <p class="confirm-text">
        {{ deleteConfirmText }}
      </p>

      <ul class="confirm-warning">
        <li>Diskon yang dihapus tidak bisa dikembalikan lagi.</li>
      </ul>

      <div class="confirm-actions">
        <button
          class="cancel-btn"
          @click="emit('cancel')"
        >
          Batalkan
        </button>

        <button
          class="delete-bulk-btn"
          @click="emit('confirm')"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  deleteMode: {
    type: String,
    default: 'bulk'
  },
  deleteConfirmText: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['cancel', 'confirm'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirm-modal {
  background: white;
  width: 420px;
  border-radius: 20px;
  padding: 24px;
}

.confirm-text {
  margin: 12px 0;
  color: #374151;
}

.confirm-warning {
  font-size: 13px;
  color: #6b7280;
  padding-left: 16px;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.cancel-btn {
  background: white;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 10px 18px;
  border-radius: 999px;
  cursor: pointer;
}

.delete-bulk-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 999px;
  cursor: pointer;
}
</style>
