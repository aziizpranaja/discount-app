<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditMode ? 'Ubah Diskon' : 'Tambah Diskon' }}</h3>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <!-- Nama Diskon -->
      <div class="form-group">
        <label :class="{ error: errors.name || errors.nameDuplicate }">
          {{ isEditMode && formData.name ? formData.name : 'Nama Diskon' }}
        </label>
        <input
          type="text"
          :value="formData.name"
          @input="$emit('update:form', { ...formData, name: $event.target.value })"
          placeholder="Misal: Diskon opening, diskon akhir tahun"
          :class="{ error: errors.name }"
        />
        <p v-if="errors.name" class="error-text">
          Nama diskon tidak boleh kosong.
        </p>
        <p v-else-if="errors.nameDuplicate" class="error-text">
          Nama diskon sudah digunakan.
        </p>
      </div>

      <!-- Diskon -->
      <div class="form-group">
        <label :class="{ error: errors.value }">Diskon</label>
        <div class="discount-row">
          <!-- INPUT -->
          <div class="discount-input-wrapper">
            <input
              type="text"
              :value="displayValue"
              @input="$emit('update:discount-value', $event.target.value)"
              :class="[
                'discount-input',
                discountType === 'percent' ? 'percent' : 'rupiah',
                errors.value ? 'error' : ''
              ]"
            />
            <p v-if="errors.value" class="error-text">
              Diskon tidak boleh kosong.
            </p>
            <!-- % suffix -->
            <span v-if="discountType === 'percent'" class="suffix">%</span>
          </div>

          <!-- TOGGLE -->
          <div class="toggle">
            <button
              type="button"
              :class="{ active: discountType === 'percent' }"
              @click="$emit('update:discount-type', 'percent')"
            >
              %
            </button>
            <button
              type="button"
              :class="{ active: discountType === 'rupiah' }"
              @click="$emit('update:discount-type', 'rupiah')"
            >
              Rp
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div
        class="modal-footer"
        :class="isEditMode ? 'edit-mode' : 'add-mode'"
      >
        <!-- DELETE (edit only) -->
        <button
          v-if="isEditMode"
          class="delete-btn"
          @click="emit('delete')"
        >
          Hapus
        </button>

        <!-- SUBMIT -->
        <button
          class="primary-btn"
          :class="{ 'full-width': !isEditMode }"
          @click="emit('submit')"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isEditMode: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    required: true
  },
  discountType: {
    type: String,
    default: 'percent'
  },
  discountValue: {
    type: String,
    default: ''
  },
  displayValue: {
    type: String,
    required: true
  },
  errors: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'close',
  'submit',
  'delete',
  'update:form',
  'update:discount-type',
  'update:discount-value'
])
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

.modal {
  background: white;
  width: 520px;
  max-width: 90vw;
  border-radius: 16px;
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.close-btn {
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 16px;
}

label {
  font-size: 14px;
  margin-bottom: 6px;
  display: block;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  outline: none;
}

.discount-row {
  display: grid;
  grid-template-columns: 1fr 110px;
  gap: 12px;
  align-items: center;
}

.discount-input-wrapper {
  position: relative;
  width: 100%;
}

.discount-input {
  width: 100%;
  height: 44px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
}

.suffix {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #6b7280;
}

.discount-input.percent {
  text-align: right;
  padding-right: 28px;
}

.discount-input.rupiah {
  text-align: left;
  padding-left: 44px;
}

.toggle {
  display: flex;
  width: 110px;
  height: 44px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  overflow: hidden;
}

.toggle button {
  flex: 1;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 14px;
}

.toggle button.active {
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: 600;
}

.modal-footer {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.modal-footer.add-mode {
  justify-content: stretch;
}

.modal-footer.edit-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.modal-footer.edit-mode .primary-btn {
  width: auto;
  padding: 10px 20px;
  border-radius: 999px;
}

.primary-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.primary-btn.full-width {
  width: 100%;
  border-radius: 999px;
  padding: 14px 0;
  font-size: 15px;
}

.delete-btn {
  background: transparent;
  border: 1px solid #e54848;
  color: #e54848;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.delete-btn:hover {
  background: #ffecec;
}

.error {
  border-color: #ef4444 !important;
  color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}
</style>
