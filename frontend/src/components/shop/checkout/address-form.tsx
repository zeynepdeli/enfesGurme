'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export interface AddressFormData {
  title: string
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  zipCode?: string
  isDefault: boolean
}

export function AddressForm({ onSubmit, onCancel, isLoading }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    title: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    zipCode: '',
    isDefault: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Adres Başlığı */}
      <div className="space-y-2">
        <Label htmlFor="title">Adres Başlığı *</Label>
        <Input
          id="title"
          placeholder="Ev, İş, vb."
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Ad Soyad */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Ad Soyad *</Label>
        <Input
          id="fullName"
          placeholder="Adınız Soyadınız"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Telefon */}
      <div className="space-y-2">
        <Label htmlFor="phone">Telefon *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="0555 123 45 67"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Adres */}
      <div className="space-y-2">
        <Label htmlFor="address">Adres *</Label>
        <Input
          id="address"
          placeholder="Mahalle, Sokak, No"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* İl / İlçe */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">İl *</Label>
          <Input
            id="city"
            placeholder="Gaziantep"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">İlçe *</Label>
          <Input
            id="district"
            placeholder="Şahinbey"
            value={formData.district}
            onChange={(e) => handleChange('district', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Posta Kodu */}
      <div className="space-y-2">
        <Label htmlFor="zipCode">Posta Kodu</Label>
        <Input
          id="zipCode"
          placeholder="27000"
          value={formData.zipCode}
          onChange={(e) => handleChange('zipCode', e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Varsayılan Adres */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) => handleChange('isDefault', checked as boolean)}
          disabled={isLoading}
        />
        <Label htmlFor="isDefault" className="cursor-pointer">
          Varsayılan adres olarak kaydet
        </Label>
      </div>

      {/* Butonlar */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
          İptal
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>
    </form>
  )
}