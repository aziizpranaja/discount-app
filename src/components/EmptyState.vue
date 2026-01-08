<template>
  <div>
    <h2 class="title">Daftar Diskon</h2>

    <div class="outlet-wrapper">
      <button class="outlet-btn" @click="emit('toggle-outlet')">
        <span class="outlet-left">
          🏪
          <span class="outlet-text">{{ outletName }}</span>
        </span>
        <span class="outlet-arrow" :class="{ open: isOutletOpen }">▾</span>
      </button>
      
      <div v-if="isOutletOpen" class="outlet-dropdown">
        <label class="outlet-label">API URL crudcrud.com</label>
        <input
          class="outlet-input"
          :value="apiUrl"
          @input="$emit('update:api-url', $event.target.value)"
          placeholder="https://crudcrud.com/api/xxxx/diskon"
        />
        <button class="apply-btn" @click="emit('apply-api-url')">
          Terapkan
        </button>
      </div>
    </div>

    <div class="empty-card">
      <img src="/empty-discount.png" class="empty-image" alt="No discounts" />
      <h3 class="empty-title">Belum Ada Diskon</h3>
      <p class="empty-desc">
        Silahkan tambah diskon untuk menarik pelanggan dan
        meningkatkan penjualan.
      </p>
      <button class="add-btn" @click="emit('add-discount')">
        + Tambah diskon
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  outletName: {
    type: String,
    required: true
  },
  apiUrl: {
    type: String,
    required: true
  },
  isOutletOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits([
  'toggle-outlet',
  'apply-api-url',
  'add-discount',
  'update:api-url'
])
</script>

<style scoped>
.title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 12px;
}

.outlet-wrapper {
  position: relative;
}

.outlet-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 14px;
  min-width: 220px;
  border-radius: 999px;
  border: 1.5px solid #d1d5db;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.outlet-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.outlet-text {
  white-space: nowrap;
}

.outlet-arrow {
  font-size: 12px;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.outlet-arrow.open {
  transform: rotate(180deg);
}

.outlet-dropdown {
  position: absolute;
  top: 56px;
  left: 0;
  width: 360px;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.outlet-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
  display: block;
}

.outlet-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  margin-bottom: 12px;
}

.apply-btn {
  background: #6db33f;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
}

.empty-card {
  border: 1px solid #eef2f7;
  border-radius: 16px;
  height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
}

.empty-image {
  width: 240px;
}

.empty-title {
  margin-top: 16px;
  font-weight: 600;
}

.empty-desc {
  color: #6b7280;
  margin: 8px 0 24px;
  max-width: 420px;
  text-align: center;
}

.add-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 999px;
  cursor: pointer;
}
</style>
