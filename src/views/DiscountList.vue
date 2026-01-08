<template>
  <div class="discount-list-page">
    <!-- Notification Toast -->
    <BaseNotification
      v-if="notification.show"
      :message="notification.message"
      :type="notification.type"
      @close="hideNotification"
    />

    <!-- Main Content Card -->
    <div class="main-card">
      <!-- Empty State -->
      <EmptyState
        v-if="!isLoading && discounts.length === 0"
        :outlet-name="outletName"
        :api-url="apiUrl"
        :is-outlet-open="isOutletOpen"
        @toggle-outlet="isOutletOpen = !isOutletOpen"
        @apply-api-url="applyApiUrl"
        @add-discount="openModal"
      />

      <!-- Data State -->
      <DiscountTable
        v-else
        :discounts="filteredDiscounts"
        :is-loading="isLoading"
        :search-query="searchQuery"
        :selected-ids="selectedIds"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        :outlet-name="outletName"
        :api-url="apiUrl"
        :is-outlet-open="isOutletOpen"
        :is-all-selected="isAllSelected"
        @update:search-query="searchQuery = $event"
        @toggle-outlet="isOutletOpen = !isOutletOpen"
        @apply-api-url="applyApiUrl"
        @add-discount="openModal"
        @edit-discount="openEdit"
        @toggle-selection="toggleSelection"
        @toggle-select-all="toggleSelectAll"
        @bulk-delete="openBulkDeleteConfirm"
        @sort="toggleSort"
        @clear-selection="clearSelection"
      />
    </div>

    <!-- Footer -->
    <AppFooter />

    <!-- Discount Modal -->
    <DiscountModal
      v-if="showModal"
      :is-edit-mode="isEditMode"
      :form-data="form"
      :discount-type="discountType"
      :discount-value="discountValue"
      :display-value="displayValue"
      :errors="errors"
      @close="closeModal"
      @submit="submit"
      @delete="deleteDiscount"
      @update:form="updateForm"
      @update:discount-type="discountType = $event"
      @update:discount-value="discountType === 'rupiah' ? discountValue = $event.replace(/\D/g, '') : discountValue = $event"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      v-if="showDeleteConfirm"
      :delete-mode="deleteMode"
      :delete-confirm-text="deleteConfirmText"
      @cancel="showDeleteConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useDiscountManagement } from '@/composables/useDiscountManagement.js'
import { useNotification } from '@/composables/useNotification'
import { useDiscountValidation } from '@/composables/useDiscountValidation'
import BaseNotification from '@/components/BaseNotification.vue'
import EmptyState from '@/components/EmptyState.vue'
import DiscountTable from '@/components/DiscountTable.vue'
import AppFooter from '@/components/AppFooter.vue'
import DiscountModal from '@/components/DiscountModal.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'

// Constants
const DEFAULT_API_URL = 'https://crudcrud.com/api/f2c085c04a0546e9a3faea361d330147/unicorns'
const OUTLET_NAME = 'Kopi Anak Bangsa'
const NOTIFICATION_DURATION = 3000

// Composables
const {
  discounts,
  isLoading,
  fetchDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount: deleteDiscountItem,
  deleteBulkDiscounts
} = useDiscountManagement(DEFAULT_API_URL)

// Test with static data for debugging
discounts.value = [
  { _id: '1', discount_name: 'Test Discount 1', discount: '10%' },
  { _id: '2', discount_name: 'Test Discount 2', discount: 'Rp 5000' }
]

const {
  notification,
  showNotification,
  hideNotification
} = useNotification(NOTIFICATION_DURATION)

const {
  errors,
  validateDiscountForm,
  isDiscountNameUnique,
  resetErrors
} = useDiscountValidation()

// Reactive State
const isEditMode = ref(false)
const selectedId = ref(null)
const showDeleteConfirm = ref(false)
const showModal = ref(false)
const searchQuery = ref('')
const isOutletOpen = ref(false)
const deleteMode = ref('bulk')
const sortKey = ref('')
const sortOrder = ref('asc')
const selectedIds = ref([])
const outletName = ref(OUTLET_NAME)
const apiUrl = ref(DEFAULT_API_URL)
const discountType = ref('percent')
const discountValue = ref('')

// Form State
const form = reactive({
  name: '',
  value: '',
  type: 'percent'
})

// Computed Properties
const displayValue = computed({
  get() {
    if (discountType.value === 'rupiah') {
      return `Rp ${discountValue.value || ''}`
    }
    return discountValue.value
  },
  set(val) {
    // Remove "Rp " prefix if it exists, then remove non-digits
    const withoutRp = val.replace(/^Rp\s*/, '')
    const numeric = withoutRp.replace(/\D/g, '')
    discountValue.value = numeric
  }
})

const filteredDiscounts = computed(() => {
  let data = [...discounts.value]

  // Apply search filter
  if (searchQuery.value) {
    data = data.filter(item =>
      item.discount_name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    )
  }

  // Apply sorting
  if (sortKey.value) {
    data.sort((a, b) => {
      let aVal = a[sortKey.value]
      let bVal = b[sortKey.value]

      if (sortKey.value === 'discount') {
        aVal = Number(aVal.replace(/\D/g, ''))
        bVal = Number(bVal.replace(/\D/g, ''))
      }

      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return data
})

const deleteConfirmText = computed(() => {
  if (deleteMode.value === 'single') {
    const item = discounts.value.find(d => d._id === selectedId.value)
    return item
      ? `Apakah Anda yakin ingin menghapus "${item.discount_name}"?`
      : 'Apakah Anda yakin ingin menghapus diskon ini?'
  }
  return 'Apakah Anda yakin ingin menghapus diskon yang dipilih?'
})

const isAllSelected = computed(() => {
  if (!filteredDiscounts.value.length) return false
  return (
    selectedIds.value.length === filteredDiscounts.value.length &&
    filteredDiscounts.value.every(d => selectedIds.value.includes(d._id))
  )
})

// Watchers
watch(searchQuery, () => {
  selectedIds.value = []
})

watch(discountType, () => {
  if (isEditMode.value) return
  discountValue.value = ''
})

// Methods
function toggleSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

function toggleSelectAll(event) {
  selectedIds.value = event.target.checked
    ? filteredDiscounts.value.map(d => d._id)
    : []
}

function toggleSelection(id) {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

function clearSelection() {
  selectedIds.value = []
}

function updateForm(newForm) {
  Object.assign(form, newForm)
}

function resetForm() {
  form.name = ''
  discountValue.value = ''
  discountType.value = 'percent'
  isEditMode.value = false
  selectedId.value = null
  resetErrors()
}

function openModal() {
  isEditMode.value = false
  selectedId.value = null
  resetForm()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

async function openEdit(id) {
  try {
    resetErrors()
    discountValue.value = ''
    discountType.value = 'percent'

    isEditMode.value = true
    selectedId.value = id
    showModal.value = true

    const discount = await fetchDiscountById(id)
    populateForm(discount)

  } catch (error) {
    console.error(error)
    showNotification('Gagal mengambil data diskon', 'error')
  }
}

async function fetchDiscountById(id) {
  const response = await fetch(`${DEFAULT_API_URL}/${id}`)
  if (!response.ok) {
    throw new Error('Gagal mengambil detail diskon')
  }
  return await response.json()
}

function populateForm(data) {
  form.name = data.discount_name

  if (data.discount.includes('%')) {
    discountType.value = 'percent'
    discountValue.value = data.discount.replace('%', '').trim()
  } else {
    discountType.value = 'rupiah'
    discountValue.value = data.discount.replace(/\D/g, '')
  }
}

function openBulkDeleteConfirm() {
  deleteMode.value = 'bulk'
  showDeleteConfirm.value = true
}

function deleteDiscount() {
  if (!selectedId.value) return
  deleteMode.value = 'single'
  showDeleteConfirm.value = true
}

async function submit() {
  const isValid = validateDiscountForm(form, discountValue.value)
  if (!isValid) return

  try {
    // Check for duplicate names (skip if editing with same name)
    if (!isEditMode.value) {
      const isUnique = await isDiscountNameUnique(form.name, DEFAULT_API_URL)
      if (!isUnique) {
        errors.nameDuplicate = true
        showNotification('Nama diskon sudah digunakan.', 'error')
        return
      }
    }

    const discountData = {
      discount_name: form.name,
      discount: discountType.value === 'percent'
        ? `${discountValue.value}%`
        : `Rp ${discountValue.value}`
    }

    if (isEditMode.value) {
      await updateDiscount(selectedId.value, discountData)
      showNotification(`${form.name} berhasil disimpan.`, 'success')
    } else {
      await createDiscount(discountData)
      showNotification(`${form.name} berhasil ditambahkan.`, 'success')
    }

    await fetchDiscounts()
    closeModal()

  } catch (error) {
    console.error(error)
    showNotification('Terjadi kesalahan.', 'error')
  }
}

async function confirmDelete() {
  try {
    if (deleteMode.value === 'single') {
      const item = discounts.value.find(d => d._id === selectedId.value)
      const discountName = item?.discount_name || 'Diskon'

      await deleteDiscountItem(selectedId.value)
      showNotification(`"${discountName}" berhasil dihapus.`, 'success')
      closeModal()
    } else {
      await deleteBulkDiscounts(selectedIds.value)
      showNotification(`${selectedIds.value.length} diskon berhasil dihapus.`, 'success')
      selectedIds.value = []
    }

    showDeleteConfirm.value = false
    await fetchDiscounts()

  } catch (error) {
    console.error(error)
    showNotification('Gagal menghapus diskon.', 'error')
  }
}

async function applyApiUrl() {
  isOutletOpen.value = false
  await fetchDiscounts()
}

// Initialize
onMounted(() => {
  fetchDiscounts()
})
</script>

<style scoped>
/* Main Layout */
.discount-list-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 32px;
}

.main-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  max-width: 1200px;
  margin: auto;
}

/* Utility Classes */
.text-center {
  text-align: center;
}

.flex {
  display: flex;
}

.flex-between {
  justify-content: space-between;
}

.flex-center {
  align-items: center;
}

.gap-12 {
  gap: 12px;
}

.gap-16 {
  gap: 16px;
}

.mb-16 {
  margin-bottom: 16px;
}

.mb-24 {
  margin-bottom: 24px;
}

/* Animation Transitions */
.modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
