<template>
  <div class="data-section">
    <div class="data-header">
      <div>
        <h3 class="data-title">Daftar Diskon</h3>
        <p class="data-sub">
          Total jumlah diskon: {{ discounts.length }}
        </p>
      </div>
      
      <div class="actions-right">
        <button
          v-if="selectedIds.length"
          class="cancel-btn"
          @click="emit('clear-selection')"
        >
          Batalkan
        </button>

        <button
          v-if="selectedIds.length"
          class="delete-bulk-btn"
          @click="emit('bulk-delete')"
        >
          Hapus
        </button>

        <button
          v-else
          class="add-btn"
          @click="emit('add-discount')"
        >
          + Tambah diskon
        </button>
      </div>
    </div>

    <div class="filters">
      <input
        class="search"
        placeholder="🔍 Cari diskon"
        :value="searchQuery"
        @input="$emit('update:search-query', $event.target.value)"
      />
      
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
    </div>

    <div class="table-wrapper">
      <table class="table">
        <colgroup>
          <col style="width: 44px" />
          <col style="width: 160px" />
          <col style="width: 160px" />
          <col style="width: 48px" />
        </colgroup>

        <thead>
          <tr>
            <th class="checkbox-col">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="selectedIds.length && !isAllSelected"
                @change="emit('toggle-select-all', $event)"
              />
            </th>
            <th @click="emit('sort', 'discount_name')" class="sortable">
              Nama Diskon
              <span class="sort-icon">
                <span v-if="sortKey !== 'discount_name'">↕</span>
                <span v-else-if="sortOrder === 'asc'">↑</span>
                <span v-else>↓</span>
              </span>
            </th>

            <th @click="emit('sort', 'discount')" class="sortable">
              Nilai Diskon
              <span class="sort-icon">
                <span v-if="sortKey !== 'discount'">↕</span>
                <span v-else-if="sortOrder === 'asc'">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="isLoading">
            <td colspan="4" class="loading-cell">
              <div class="loading-spinner"></div>
              <span>Loading...</span>
            </td>
          </tr>
          <tr v-else v-for="item in discounts" :key="item._id">
            <td class="checkbox-col">
              <input
                type="checkbox"
                :value="item._id"
                :checked="selectedIds.includes(item._id)"
                @change="emit('toggle-selection', item._id)"
              />
            </td>

            <td>
              {{ item.discount_name }}
              <span class="badge">baru</span>
            </td>

            <td>{{ item.discount }}</td>

            <td class="action" @click="emit('edit-discount', item._id)">🖊</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  discounts: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  searchQuery: {
    type: String,
    default: ''
  },
  selectedIds: {
    type: Array,
    default: () => []
  },
  sortKey: {
    type: String,
    default: ''
  },
  sortOrder: {
    type: String,
    default: 'asc'
  },
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
  },
  isAllSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:search-query',
  'update:api-url',
  'toggle-outlet',
  'apply-api-url',
  'add-discount',
  'edit-discount',
  'toggle-selection',
  'toggle-select-all',
  'bulk-delete',
  'sort',
  'clear-selection'
])
</script>

<style scoped>
.data-section {
  margin-top: 16px;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.data-title {
  font-size: 18px;
  font-weight: 600;
}

.data-sub {
  font-size: 13px;
  color: #6b7280;
}

.filters {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.search {
  width: 280px;
  max-width: 100%;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
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

.table-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  background: white;
}

.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.table thead {
  background: #f9fafb;
}

.table th {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.table td {
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.checkbox-col {
  width: 44px;
  text-align: center;
}

.table input[type="checkbox"] {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  accent-color: #4caf50;
  cursor: pointer;
}

.badge {
  margin-left: 8px;
  font-size: 11px;
  font-weight: 500;
  color: #2563eb;
  background: #e0f2fe;
  padding: 2px 8px;
  border-radius: 999px;
}

.table td:first-child + td {
  font-weight: 500;
}

.table td:nth-child(3) {
  color: #374151;
  font-weight: 500;
}

.action {
  width: 40px;
  text-align: center;
  cursor: pointer;
  color: #6b7280;
}

.action:hover {
  color: #111827;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: #f3f4f6;
}

.sort-icon {
  margin-left: 6px;
  font-size: 11px;
  color: #9ca3af;
}

.actions-right {
  display: flex;
  gap: 10px;
}

.add-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 999px;
  cursor: pointer;
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

.loading-cell {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
