import { ref } from 'vue'

export function useDiscountManagement(apiUrl) {
  const discounts = ref([])
  const isLoading = ref(false)

  async function fetchDiscounts() {
    isLoading.value = true
    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error('Gagal mengambil data diskon')
      }
      discounts.value = await response.json()
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createDiscount(discountData) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discountData)
    })

    if (!response.ok) {
      throw new Error('Gagal menambahkan diskon')
    }

    // Handle empty response or non-JSON response
    const text = await response.text()
    if (!text) {
      return null
    }
    
    try {
      return JSON.parse(text)
    } catch (error) {
      console.warn('Response is not valid JSON, returning null:', text)
      return null
    }
  }

  async function updateDiscount(id, discountData) {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discountData)
    })

    if (!response.ok) {
      throw new Error('Gagal mengupdate diskon')
    }

    // Handle empty response or non-JSON response
    const text = await response.text()
    if (!text) {
      return null
    }
    
    try {
      return JSON.parse(text)
    } catch (error) {
      console.warn('Response is not valid JSON, returning null:', text)
      return null
    }
  }

  async function deleteDiscount(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Gagal menghapus diskon')
    }
  }

  async function deleteBulkDiscounts(ids) {
    await Promise.all(
      ids.map(id => deleteDiscount(id))
    )
  }

  return {
    discounts,
    isLoading,
    fetchDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    deleteBulkDiscounts
  }
}
