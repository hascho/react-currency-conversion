import { useMemo, memo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import type { CurrencyListItem } from './use-currencies-list'

type CurrencySelectProps = {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  currencies: CurrencyListItem[]
}

export const CurrencySelect = memo((props: CurrencySelectProps) => {
  const { value, onValueChange, placeholder = 'Currency', currencies: data } = props
  
  const options = useMemo(() => {
    if (!data) return []

    return data.sort((a, b) => a.name.localeCompare(b.name)).map(item => ({
      id: item.short_code,
      label: `(${item.symbol}) ${item.name}`
    }))
  }, [data])
  
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className='w-[250px] truncate'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})