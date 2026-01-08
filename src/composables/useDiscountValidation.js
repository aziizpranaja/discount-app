import { reactive } from 'vue'

export function useDiscountValidation() {
  const errors = reactive({
    name: false,
    nameDuplicate: false,
    value: false
  })

  function validateDiscountForm(form, discountValue) {
    resetErrors()
    
    let isValid = true

    if (!form.name) {
      errors.name = true
      isValid = false
    }

    const numeric = Number(discountValue)
    if (!discountValue || isNaN(numeric) || numeric <= 0) {
      errors.value = true
      isValid = false
    }

    return isValid
  }

  async function isDiscountNameUnique(name, apiUrl) {
    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error('Gagal mengambil data diskon')
      }

      const data = await response.json()
      return !data.some(
        item => item.discount_name.toLowerCase() === name.toLowerCase()
      )
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  function resetErrors() {
    errors.name = false
    errors.nameDuplicate = false
    errors.value = false
  }

  return {
    errors,
    validateDiscountForm,
    isDiscountNameUnique,
    resetErrors
  }
}
