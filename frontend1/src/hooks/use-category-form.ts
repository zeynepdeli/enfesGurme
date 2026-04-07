import { useState, useEffect } from 'react'
import { Category } from '@/types'

export function useCategoryForm(initialCategory?: Category | null) {
  const [formData, setFormData] = useState({
    name: initialCategory?.name || '',
    slug: initialCategory?.slug || '',
    description: initialCategory?.description || '',
    image: initialCategory?.image || ''
  })

  useEffect(() => {
    if (initialCategory) {
      setFormData({
        name: initialCategory.name,
        slug: initialCategory.slug,
        description: initialCategory.description || '',
        image: initialCategory.image || ''
      })
    }
  }, [initialCategory])

  const updateName = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    })
  }

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const reset = () => {
    setFormData({ name: '', slug: '', description: '', image: '' })
  }

  return {
    formData,
    updateName,
    updateField,
    reset
  }
}
